const socket = io('http://localhost:3000')
import Player from "./Player.js"
import { getCardInfo, statsContainer, readyButton, changeButton, c1, c2, c3, c4, c5} from "./DOM.js"
game.width = 640
game.height = 480
const ctx = game.getContext("2d")
let secondsPassed = 0
let oldTimeStamp = 0
let fps = 0

let gameObjects = []
let myID = null
let player = null
let hasChanged = false

socket.on('room-created', room => {
    const roomElement = document.createElement('div')
    roomElement.innerText = room
    const roomLink = document.createElement('a')
    roomLink.href = `/${room}`
    roomLink.innerText = 'join'
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
  })

socket.on('user-connected', (playerData) => {
    statsContainer.value += "\n" + playerData.name + " joined the room"
    statsContainer.scrollTop = statsContainer.scrollHeight
})

socket.on('announce-winner', (winner, winnerName) => {
    statsContainer.value += "\n" + winnerName + " wins with " + winner[0].descr + "!"
    statsContainer.scrollTop = statsContainer.scrollHeight
})

socket.on('user-disconnected', (playerData) => {
    statsContainer.value += "\n" + playerData.name + " left the room" 
    statsContainer.scrollTop = statsContainer.scrollHeight
    // Remove leaver's id
    for (let i = 0; i < gameObjects.length; i++) {
        if (gameObjects[i].id === playerData.id) {
            gameObjects.splice(i, 1)
        }
    }
})

// Show cards on player GUI 
socket.on('update-gui', playerData => {
    getCardInfo(playerData)
})

socket.on('personal-id', (socketID) => {
    myID = socketID
})

socket.on('send-data', (gameData) => {
    // id name room balance hand ready display position
    for (let i = 0; i < gameData.length; i++) {
        let id = gameData[i].id
        let name = gameData[i].name
        let room = gameData[i].room
        let balance = gameData[i].balance
        let hand = gameData[i].hand
        let ready = gameData[i].ready
        let display = gameData[i].display
        let position = gameData[i].position
        
        // update self to ease future referencing
        if (gameData[i].id === myID) {
            player = gameData[i]
        }

        gameObjects[i] = new Player(id, name, room, balance, hand, ready, display, position)
    }
})

// When you are ready to check cards...
readyButton.addEventListener('click', e => {
    e.preventDefault()
    if (player !== null) {
        if (!player.ready) {
            socket.emit('ready-to-check')
        }
    } 
})

// Get unselected cards and change them on changeButton click
changeButton.addEventListener('click', e => {
    e.preventDefault()
    let cardsToChange = [0,0,0,0,0]
    if (player !== null) {
        if (!hasChanged && !player.ready) {
            if (!c1.checked) cardsToChange[0] = 1
            if (!c2.checked) cardsToChange[1] = 1
            if (!c3.checked) cardsToChange[2] = 1
            if (!c4.checked) cardsToChange[3] = 1
            if (!c5.checked) cardsToChange[4] = 1
            socket.emit('change-cards', cardsToChange)
            hasChanged = true
        }
    }
})

function init() {
    const name = prompt('What is your name?')
    socket.emit('new-user', roomName, name)
    window.requestAnimationFrame(gameLoop)
}

function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000
    oldTimeStamp = timeStamp

    // Calculate fps
    fps = Math.round(1 / secondsPassed)

    //console.log(fps)

    draw()
    window.requestAnimationFrame(gameLoop)
}

function clear() {
    ctx.clearRect(0,0, game.width, game.height)
}

let displayTimer = 500

function draw() {
    clear()
    // Loop through the game objects
    for (let i = 0; i < gameObjects.length; i++) {
        if (gameObjects[i].id === myID && gameObjects[i].display === false) {
            gameObjects[i].update()
            gameObjects[i].draw()
        } else if (gameObjects[i].id !== myID && gameObjects[i].display === false) {
            gameObjects[i].update()
            gameObjects[i].drawCardbacks()
        } else if (gameObjects[i].display) {
            displayTimer--
            console.log(displayTimer)
            gameObjects[i].update()
            gameObjects[i].draw()
            if (displayTimer < 1) {
                gameObjects[i].ready = false
                gameObjects[i].display = false
                socket.emit('update-player-state', roomName)
                displayTimer = 500
                hasChanged = false
            }
        }
    }
}

init()