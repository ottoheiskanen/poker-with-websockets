export default class Timer {
    constructor(x, y, radius, start, end, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.start = start
        this.end = end
        this.color = color

        this.ctx = document.getElementById("game").getContext("2d");
    }

    animate(percent) {
        let pct = percent / 100
    }

    render(percent) {
        let quart = Math.PI / 2;
        let PI2 = Math.PI * 2;

        let pct = percent / 100
        let extent = parseInt((this.end - this.start) * pct)
        let current = (this.end - this.start) / 100 * PI2 * pct - quart
        this.ctx.lineWidth = 15
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.radius, -quart, current)
        this.ctx.strokeStyle = this.color
        this.ctx.stroke()
        this.ctx.fillStyle = this.color
        this.ctx.fillText(extent, this.x - 15, this.y + 5)
    }
}