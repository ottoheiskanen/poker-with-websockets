import Player from "../Player.js"
game.width = 640
game.height = 480
const ctx = game.getContext("2d")
let secondsPassed
let oldTimeStamp
let fps

let gameObjects = []

// Search for id that was returned from the server side and get right card values to checkboxs
function getCardInfo(id) {
    for (let i = 0; i < gameObjects.length; i++) {
        if (gameObjects[i].id === id) {
            cl1.innerText = gameObjects[i].hand[0]
            cl2.innerText = gameObjects[i].hand[1]
            cl3.innerText = gameObjects[i].hand[2]
            cl4.innerText = gameObjects[i].hand[3]
            cl5.innerText = gameObjects[i].hand[4]
        }
    }
}

function init() {
    gameObjects.push(new Player(1, "otto", "paska", 500, ['a5', 'a4', 'a3', 'a2', 'a1'], false, false, 1))
    gameObjects.push(new Player(2, "ilari", "paska", 500, ['b5', 'b4', 'b3', 'b2', 'b1'], false, false, 2))
    gameObjects.push(new Player(3, "ville", "paska", 500, ['c5', 'c4', 'c3', 'c2', 'c1'], false, false, 3))
    gameObjects.push(new Player(4, "nakkeri", "paska", 500, ['d5', 'd4', 'd3', 'd2', 'd1'], false, false, 4))
    getCardInfo(1)
    window.requestAnimationFrame(gameLoop)
}

function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000
    oldTimeStamp = timeStamp

    // Calculate fps
    fps = Math.round(1 / secondsPassed)

    console.log(fps)

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