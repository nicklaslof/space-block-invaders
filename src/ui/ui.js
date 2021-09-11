class UI{
    constructor() {
        this.cv = document.getElementById("u");
        this.cv.width = W;
        this.cv.height = H;
        this.ctx = this.cv.getContext('2d');
        this.cv.addEventListener('click', (e) => { this.cv.requestPointerLock();});
    }


    render(){
        this.ctx.clearRect(0,0,W,H);
        this.drawTextAt("+",W/2,H/2,"white",32);

    }

    drawTextAt(text,x,y,col, fontSize=16){
        this.ctx.globalAlpha = 1.0
        this.ctx.font = "normal "+fontSize+"px monospace";
        this.ctx.fillStyle = col;
        this.ctx.fillText(text,x,y);
    }
}

export default UI;