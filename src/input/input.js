// Handles the player input. Either from a gamepad or the keyboard
class Input{

    constructor() {
        this.usePressedPreviously = false;
        document.addEventListener("mousemove", this.handleMouseMouseEvent.bind(this));
        document.addEventListener("mousedown", this.handleMouseMouseDownEvent.bind(this));
        document.addEventListener("mouseup", this.handleMouseMouseUpEvent.bind(this));
        this.mouseX = 0;
        this.mouseY = 0;
    }

    handleMouseMouseEvent(e){
        this.mouseX = -e.movementX;
        this.mouseY = -e.movementY;
    }

    handleMouseMouseDownEvent(e){
        this.leftClicked = e.button == 0;
        this.rightClicked = e.button == 2;
    }
    handleMouseMouseUpEvent(e){
        this.leftClicked != e.button == 0;
        this.rightClicked != e.button == 2;
    }

    getMouseX(){
        let m = this.mouseX;
        this.mouseX=0;
        return m;
    }

    getMouseY(){
        let m = this.mouseY;
        this.mouseY=0;
        return m;
    }

    getLeftClicked(){
        let v = this.leftClicked;
        this.leftClicked = false;
        return v;
    }

    getRightClicked(){
        let v = this.rightClicked;
        this.rightClicked = false;
        return v;
    }

    tick(game){
        // reset all inputs and read them on each tick
        this.axes = {x:0,y:0};
        this.firePressed = false;
        this.usePressed = false;
        this.hasGamepad = false;

        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        var gp = gamepads[0];

        if (gp != null){
            this.hasGamepad = true;
            if (gp.axes[0] >0.4) this.axes.x = gp.axes[0];
            if (gp.axes[0] <-0.4) this.axes.x = gp.axes[0];
            if (gp.axes[1] >0.4) this.axes.y = gp.axes[1];
            if (gp.axes[1] <-0.4) this.axes.y = gp.axes[1];
            if (gp.buttons[0].pressed) this.firePressed = true;
            // usePressedPreviously is to stop the usekey to spam a new click when holding it down
            if (gp.buttons[3].pressed && !this.usePressedPreviously) this.usePressed = true;
            this.usePressedPreviously = gp.buttons[3].pressed;
        }else{
            if (game.keys[68] == "keydown" || game.keys[39] == "keydown") this.axes.x = 1;
            if (game.keys[65] == "keydown" || game.keys[37] == "keydown") this.axes.x = -1;
            if (game.keys[83] == "keydown" || game.keys[40] == "keydown") this.axes.y = 1;
            if (game.keys[87] == "keydown" || game.keys[38] == "keydown") this.axes.y = -1;
            if (game.keys[32] == "keydown") this.firePressed = true;
            // usePressedPreviously is to stop the usekey to spam a new click when holding it down
            if (game.keys[69] == "keydown" && !this.usePressedPreviously) this.usePressed = true;
            this.usePressedPreviously = game.keys[69] == "keydown";
        }
    }
}
export default Input;