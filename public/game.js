const socket = io('http://localhost:3000')
import Player from "./Player.js"
import { getCardInfo, statsContainer, readyButton } from "./DOM.js"
game.width = 640
game.height = 480
const ctx = game.getContext("2d")
let secondsPassed = 0
let oldTimeStamp = 0
let fps = 0

let gameObjects = []
let myID

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

        gameObjects[i] = new Player(id, name, room, balance, hand, ready, display, position)
    }
})

// When you are ready to check cards...
readyButton.addEventListener('click', e => {
    e.preventDefault()
    socket.emit('ready-to-check')
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
            }
        }
    }
}

init()