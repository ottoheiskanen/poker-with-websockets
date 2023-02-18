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
        socket.emit('update-gui', playerData)
        console.log(playerData)
        console.log(rooms)
    })
    
    setInterval(function() {
        getUserRooms(socket).forEach(room => {
            let gameData = gatherRoomData(room)
            io.sockets.in(room).emit('send-data', gameData)
        })
    }, 1000)

    socket.on('disconnect', () => {
        getUserRooms(socket).forEach(room => {
            socket.to(room).emit('user-disconnected', rooms[room].users[socket.id])
            delete rooms[room].users[socket.id]
        })
    })
})

function gatherRoomData(room){
    let gameData = []
    const clients = io.sockets.adapter.rooms.get( room );
    clientList = Array.from( clients )
    clientList.forEach(client => {
        gameData.push(rooms[room].users[client])
    })
    return gameData
}

// Get room names
function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if (room.users[socket.id] != null) names.push(name)
        return names 
    }, [])
}