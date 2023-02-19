const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const server = require('http').Server(app)
const io = require('socket.io')(server)
const Deck = require('./Deck.js')
const PlayerData = require("./PlayerData.js")
const Hand = require('pokersolver').Hand; 

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const rooms = {}

app.get('/', (req, res) => {
    res.render('index', {rooms: rooms})
})

app.post('/room', (req, res) => {
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
    }

    rooms[req.body.room] = {
        users: {},
        deck: new Deck()
    }

    res.redirect(req.body.room)
    io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
    if (rooms[req.params.room] == null) {
        return res.redirect('/')
    }
    res.render('room', {roomName: req.params.room})
})

server.listen( PORT )

io.on('connection', socket => {
    socket.on('new-user', (room, name) => {
        let clientList 
        const clients = io.sockets.adapter.rooms.get( room );
        if (clients !== undefined) {
            clientList = Array.from( clients )
        } else {
            clientList = []
        }
        // Debug
        if (clientList.length > 4) {
            console.log("Too many users in the room")
        }

        let playerData = new PlayerData(socket.id, name, room, 500, rooms[room].deck.dealCards(5), false, false, clientList.length+1)
        socket.join(room)
        rooms[room].users[socket.id] = playerData
        io.sockets.in(room).emit('user-connected', playerData)
        socket.emit('personal-id', socket.id)
        socket.emit('update-gui', playerData)
        console.log(rooms)
    })
    
    setInterval(function() {
        getUserRooms(socket).forEach(room => {
            let [gameData, check] = gatherRoomData(room)
            // if all players are ready to check their cards
            if (check) {
                gameData.forEach(player => {
                    player.display = true
                })
            }
            io.sockets.in(room).emit('send-data', gameData)
        })
    }, 1000)

    // When client clicks readyButton...
    socket.on('ready-to-check', () => {
        getUserRooms(socket).forEach(room => {
            rooms[room].users[socket.id].ready = true
            console.log(rooms[room].users[socket.id])
        })
    })

    // Sets all clients display to false after first client's displayTimer has set on
    socket.on('update-player-state', (room) => {
        const clients = io.sockets.adapter.rooms.get( room );
        let clientList = Array.from( clients )
        clientList.forEach(client => {
            rooms[room].users[client].ready = false
            rooms[room].users[client].display = false
        })
    })

    // When client disconnects; delete from room
    socket.on('disconnect', () => {
        getUserRooms(socket).forEach(room => {
            socket.to(room).emit('user-disconnected', rooms[room].users[socket.id])
            delete rooms[room].users[socket.id]
        })
    })
})

// Gather all player data from the room and fix position before sending to client side
function gatherRoomData(room){
    let gameData = []
    let playersReady = 0
    let check = false
    const clients = io.sockets.adapter.rooms.get( room );
    clientList = Array.from( clients )

    // Fix positioning, count player's who are ready to check and return data that is ready to be sent to client
    for (let i = 0; i < clientList.length; i++) {
        rooms[room].users[clientList[i]].position = i + 1
        if (rooms[room].users[clientList[i]].ready) {
            playersReady++
        }
        gameData.push(rooms[room].users[clientList[i]])
    }
    if (playersReady === clientList.length) {
        check = true
    }
    return [gameData, check]
}

// Get room names
function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if (room.users[socket.id] != null) names.push(name)
        return names 
    }, [])
}