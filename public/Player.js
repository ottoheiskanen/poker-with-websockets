export default class Player {
    constructor(id, name, room, balance, hand, ready, display, position) {
        this.id = id // set this to socket id
        this.name = name
        this.room = room
        this.balance = balance
        this.hand = hand
        this.ready = ready
        this.display = display
        this.position = position

        this.x = 0
        this.y = 0

        switch(this.position) {
            case 1:
                this.x = 204
                this.y = 20; break;
            case 2:
                this.x = 20
                this.y = 145; break;
            case 3: 
                this.x = 375
                this.y = 145; break;
            case 4: 
                this.x = 204
                this.y = 268; break;
        }

        this.ctx = document.getElementById("game").getContext("2d");

        this.cardW = 50
        this.cardH = 75

        this.switch = [] 
    }

    move() {
        
    }

    switchCards(newCards = []) {

    }

    update() {
        
    }

    draw() {
        this.ctx.font  = "18px serif"
        this.ctx.fillStyle = "black"
        this.ctx.fillText(this.name, this.x, this.y-4)

        
        for (let i = 0; i < this.hand.length; i++) {
            this.ctx.fillStyle = "white"
            this.ctx.fillRect(this.x + i * this.cardW, this.y, this.cardW-5, this.cardH)
            this.ctx.fillStyle = "black"
            this.ctx.fillText(this.hand[i], this.x + (i * this.cardW), this.y+32)
        }
    }

}