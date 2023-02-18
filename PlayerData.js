// Middleware class between server side data transfer and client side player 
class PlayerData {
    constructor(id, name, room, balance, hand, ready, display, position) {
        this.id = id // set this to socket id
        this.name = name
        this.room = room
        this.balance = balance
        this.hand = hand
        this.ready = ready
        this.display = display
        this.position = position
    }
}

module.exports = PlayerData