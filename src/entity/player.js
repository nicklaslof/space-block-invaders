import Entity from "./entity.js";
const up = {x:0,y:1,z:0};
const down = {x:0,y:-1,z:0}
class Player extends Entity{

    constructor(xPos, yPos, zPos) {
        super(xPos,yPos,zPos);
        this.velocity = {x:0,z:0};
        this.strafe = {x:0,z:0};
        this.tempVector = {x:0,z:0};
        this.jump = false;
        this.jumpCounter = 0;
    }

    tick (game, deltaTime){
        this.velocity.x = 0;
        this.velocity.z = 0;
        this.strafe.x = 0;
        this.strafe.z = 0;
    
        if (this.jump){
            this.jumpAngle += deltaTime*8;
            var j = Math.sin(this.jumpAngle);
            this.pos.y += j/7;
            if (this.jumpAngle >= (Math.PI*2)-1.5) this.jump = false;
        }

        game.camera.rotate((game.input.getMouseX()/9) * deltaTime);
        game.camera.rotateX((game.input.getMouseY()/9) * deltaTime);
        let cameraDirection = game.camera.getDirection();

        this.velocity.z = game.input.axes.y;

        if (game.input.axes.x < 0) this.cross(this.strafe,cameraDirection,up);
        if (game.input.axes.x > 0) this.cross(this.strafe,cameraDirection,down);

        

        if (game.input.usePressed){
            var block = game.world.rayPickBlock(game,this.pos.x,this.pos.y+4,this.pos.z,cameraDirection,15);
             console.log(block);
             if (block != null)game.world.setBlockAt(game,block.x,block.y, block.z, null);
        }

        if (this.velocity.x !=0 || this.velocity.z != 0 || this.strafe.x != 0 || this.strafe.z !=0){
            //combine forward/backward movement with strafe movement and multiply that with the direction the camera is facing
            this.tempVector.x = cameraDirection.x * this.velocity.z + this.strafe.x;
            this.tempVector.z = cameraDirection.z * this.velocity.z + this.strafe.z;

            //normalize it to prevent moving faster when strafing and moving forward/backward at the same time
            this.normalize(this.tempVector);

            //multiply the final normalized movement with the speed the player will move multiplied with the deltatime
            this.tempVector.x *= deltaTime*this.speed;
            this.tempVector.z *= deltaTime*this.speed;

            //finally add the current position of the player to the calculated movement vector
            this.tempVector.x += this.pos.x;
            this.tempVector.z += this.pos.z;

            //check if the player can move in X or Z direction separetly to allow sliding on the walls. Otherwise the player would get stuck when close to a wall
            //which would be very annoying. If the player can move to the new position then transform the current position to that position.
            if (this.canMove(game,this.tempVector.x,this.pos.y, this.pos.z)) this.pos.x += this.tempVector.x-this.pos.x;
            if (this.canMove(game,this.pos.x,this.pos.y,this.tempVector.z)) this.pos.z += this.tempVector.z-this.pos.z;
        }
        this.tempVector.y = this.pos.y - (deltaTime*15);
        if (!this.onGround(game,this.tempVector.y) && !this.jump){
            this.pos.y += this.tempVector.y-this.pos.y;
        } else{
            if(game.input.firePressed && !this.jump){
                this.jumpAngle = 0;
                this.jump = true;
            }
        }

        game.camera.setPos(this.pos);
    }

    render(game){
        
    }

    

 

}

export default Player;