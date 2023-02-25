class Deck {
    constructor() {
        this.deck = 
        ['Ad', 'Kd', 'Qd', 'Jd', 'Td', '9d', '8d', '7d', '6d', '5d', '4d', '3d', '2d',
        'Ac', 'Kc', 'Qc', 'Jc', 'Tc', '9c', '8c', '7c', '6c', '5c', '4c', '3c', '2c',
        'As', 'Ks', 'Qs', 'Js', 'Ts', '9s', '8s', '7s', '6s', '5s', '4s', '3s', '2s',
        'Ah', 'Kh', 'Qh', 'Jh', 'Th', '9h', '8h', '7h', '6h', '5h', '4h', '3h', '2h']
    }

    // returns a card
    dealCards(amount) {
        let cards = []
        for (let i = 0; i < amount; i++) {
            let index = Math.floor(Math.random() * this.deck.length)
            cards.push(this.deck[index])
            this.deck.splice(index, 1)
        }   
        return cards
    }
}
module.exports = Deck