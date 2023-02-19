import { cardC, cardS, cardH, cardD, cardback } from "./DOM.js"
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
            default:
                this.x = 204
                this.y = 20; break;
        }

        this.ctx = document.getElementById("game").getContext("2d");

        this.cardW = 50
        this.cardH = 75

        this.switch = [] 

        //this.displayCounter = 0
    }

    move() {
        
    }

    switchCards(newCards = []) {

    }

    update() {
        // Show cards for awhile before going to next game
        /*if (this.display && this.displayCounter < 250) {
            this.displayCounter++
            console.log(this.displayCounter)
        } else {
            this.display = false
            this.displayCounter = 0
        }*/
    }

    draw() {
        this.ctx.font  = "18px serif"
        this.ctx.fillStyle = "white"
        this.ctx.fillText(this.name + "'s hand", this.x+275/4, this.y-4)

        
        for (let i = 0; i < this.hand.length; i++) {
            this.ctx.fillStyle = "white"
            //this.ctx.fillRect(this.x + i * this.cardW, this.y, this.cardW-5, this.cardH)
            switch (this.hand[i][1]) {
                case "h": this.ctx.drawImage(cardH, this.x + i * this.cardW, this.y, this.cardW, this.cardH); break;
                case "d": this.ctx.drawImage(cardD, this.x + i * this.cardW, this.y, this.cardW, this.cardH); break;
                case "c": this.ctx.drawImage(cardC, this.x + i * this.cardW, this.y, this.cardW, this.cardH); break;
                case "s": this.ctx.drawImage(cardS, this.x + i * this.cardW, this.y, this.cardW, this.cardH); break;
                default:
                    this.ctx.fillStyle = "white"
                    this.ctx.fillRect(this.x + i * this.cardW, this.y, this.cardW-5, this.cardH); break;
            }
            //this.ctx.drawImage(cardC,this.x + i * this.cardW, this.y, this.cardW, this.cardH)
            this.ctx.fillStyle = "black"
            this.ctx.fillText(this.hand[i][0], this.x + (i * this.cardW + (this.cardW/2-8)), this.y+32)
        }
    }

    drawCardbacks() {
        this.ctx.font  = "18px serif"
        this.ctx.fillStyle = "white"
        this.ctx.fillText(this.name + "'s hand", this.x+275/4, this.y-4)

        for (let i = 0; i < this.hand.length; i++) {
            this.ctx.drawImage(cardback, this.x + i * this.cardW, this.y, this.cardW, this.cardH)
        }
    }

}