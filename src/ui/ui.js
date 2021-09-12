class UI{
    constructor(texture) {
        this.cv = document.getElementById("u");
        this.cv.width = W;
        this.cv.height = H;
        this.ctx = this.cv.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.cv.addEventListener('click', (e) => { this.cv.requestPointerLock();});
        this.texture = texture;

       
    }


    render(game){
        this.ctx.clearRect(0,0,W,H);

        if (game.introShowing){
            this.drawTextAt("Space block invaders",(W/2)-155,H/2,"white",24);
            this.drawTextAt("A game for JS13k 2021 by Nicklas Löf",(W/2)-180,(H/2)+30,"white",16);
            this.drawTextAt("WASD, space and mouse to play",(W/2)-140,(H/2)+60,"white",16);
            this.drawTextAt("Protect your world from the invaders!",(W/2)-185,(H/2)+120,"white",16);
            this.drawTextAt("Press space to start!",(W/2)-120,(H/2)+150,"white",16);
            
        }else if (game.generating){
            this.drawTextAt("World is generating. Please wait",(W/2)-150,(H/2)+30,"white",16);
        }else if (game.gameover){
            this.drawTextAt("Game over! Reload the page to play in a new random world!",(W/2)-290,(H/2)+30,"white",16);
        }else{
            this.drawTextAt("+",W/2,H/2,"white",32);
            var playerHealth = game.world.player.health;
            for (let i = 0; i < playerHealth; i++) {
                this.ctx.drawImage(this.texture,20,4,8,8,16 + (32*i),16,32,32);     
            }
            
    
        }

    }

    drawTextAt(text,x,y,col, fontSize=16){
        this.ctx.globalAlpha = 1.0
        this.ctx.font = "normal "+fontSize+"px monospace";
        this.ctx.fillStyle = col;
        this.ctx.fillText(text,x,y);
    }
}

export default UI;