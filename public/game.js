const socket = io('http://localhost:3000')
import Player from "./Player.js"
import { getCardInfo, statsContainer } from "./DOM.js"
game.width = 640
game.height = 480
const ctx = game.getContext("2d")
let secondsPassed = 0
let oldTimeStamp = 0
let fps = 0

let gameObjects = []

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
    console.log(playerData)
    statsContainer.value += "\n" + playerData.name + " joined the room"
})

socket.on('user-disconnected', (playerData) => {
    statsContainer.value += "\n" + playerData.name + " left the room" 
})

// Show cards on player GUI 
socket.on('update-gui', playerData => {
    getCardInfo(playerData)
})

socket.on('send-data', (gameData) => {
    //gameObjects = gameData
    // id name room balance hand ready display position
    for (let i = 0; i < gameData.length; i++) {
        //gameObjects[i] = new Player(gameData[i])
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

function init() {
    const name = prompt('What is your name?')
    socket.emit('new-user', roomName, name)

    /*gameObjects.push(new Player(1, "otto", "paska", 500, ['a5', 'a4', 'a3', 'a2', 'a1'], false, false, 1))
    gameObjects.push(new Player(2, "ilari", "paska", 500, ['b5', 'b4', 'b3', 'b2', 'b1'], false, false, 2))
    gameObjects.push(new Player(3, "ville", "paska", 500, ['c5', 'c4', 'c3', 'c2', 'c1'], false, false, 3))
    gameObjects.push(new Player(4, "nakkeri", "paska", 500, ['d5', 'd4', 'd3', 'd2', 'd1'], false, false, 4))
    */
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

function draw() {
    clear()
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update()
        gameObjects[i].draw()
    }
}

init()