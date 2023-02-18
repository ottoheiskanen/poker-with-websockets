export const game = document.getElementById("game")
export const readyButton = document.getElementById("ready-button")
export const changeButton = document.getElementById("change-button")
export const foldButton = document.getElementById("fold-button")
export const statsContainer = document.getElementById("stats-container")
export const stateContainer = document.getElementById("state-container")
export const c1 = document.getElementById("card1")
export const c2 = document.getElementById("card2")
export const c3 = document.getElementById("card3")
export const c4 = document.getElementById("card4")
export const c5 = document.getElementById("card5")

export const cl1 = document.getElementById("cl1")
export const cl2 = document.getElementById("cl2")
export const cl3 = document.getElementById("cl3")
export const cl4 = document.getElementById("cl4")
export const cl5 = document.getElementById("cl5")

// Search for id that was returned from the server side and get right card values to checkboxs
export function getCardInfo(id, gameObjects) {
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