import Entity from "./entity.js";
const up = {x:0,y:1,z:0};
const down = {x:0,y:-1,z:0}
class Player extends Entity{

    constructor(xPos, yPos, zPos) {
        super(xPos,yPos,zPos);
        this.velocity = {x:0,z:0};
        this.strafe = {x:0,z:0};
        this.tempVector = {x:0,y:0,z:0};
        this.jump = false;
        this.jumpCounter = 0;
        this.timeFallen = 0;
    }

    tick (game){
        super.tick(game);
        this.velocity.x = 0;
        this.velocity.z = 0;
        this.strafe.x = 0;
        this.strafe.z = 0;
        if (this.jump){
            this.jumpAngle += 0.144;
            var j = Math.sin(this.jumpAngle);

            this.tempVector.y = this.pos.y += j/8;

            var b = this.canMove(game,this.pos.x,this.tempVector.y,this.pos.z);

            if (b == null) this.pos.y += this.tempVector.y - this.pos.y;
            else this.pos.y = b.y;

            if (this.jumpAngle >= (Math.PI*2)) this.jump = false;
        }

        game.camera.rotate((game.input.getMouseX()/9) * 0.016);
        game.camera.rotateX((game.input.getMouseY()/9) * 0.016);
        let cameraDirection = game.camera.getDirection();

        this.velocity.z = game.input.axes.y;

        if (game.input.axes.x < 0) this.cross(this.strafe,cameraDirection,up);
        if (game.input.axes.x > 0) this.cross(this.strafe,cameraDirection,down);

        if (game.input.getLeftClicked()){
            var block = game.world.rayPickBlock(game,this.pos.x+0.5,this.pos.y+1.6,this.pos.z+0.5,cameraDirection,6);
            if (block != null) game.world.setBlockAt(game,block.x,block.y, block.z, null);
        }
        if (game.input.getRightClicked()){
            var block = game.world.rayPickBlock(game,this.pos.x+0.75,this.pos.y+1.6,this.pos.z+0.75,cameraDirection,12);
            var direction = {x:Math.round(cameraDirection.x),y:Math.round(cameraDirection.y),z:Math.round(cameraDirection.z)};
            //console.log(direction.x+ " "+direction.y+" "+direction.z+" "+block.x+" "+block.y+" "+block.z);
            if (block != null) game.world.setBlockAt(game,block.x+direction.x,block.y+direction.y, block.z+direction.z, game.blocks.dirt);
        }

        if (this.velocity.x !=0 || this.velocity.z != 0 || this.strafe.x != 0 || this.strafe.z !=0){
            //combine forward/backward movement with strafe movement and multiply that with the direction the camera is facing
            this.tempVector.x = cameraDirection.x * this.velocity.z + this.strafe.x;
            this.tempVector.z = cameraDirection.z * this.velocity.z + this.strafe.z;

            //normalize it to prevent moving faster when strafing and moving forward/backward at the same time
            this.normalize(this.tempVector);

            //multiply the final normalized movement with the speed the player will move
            this.tempVector.x *= this.speed;
            this.tempVector.z *= this.speed;

            //finally add the current position of the player to the calculated movement vector
            this.tempVector.x += this.pos.x;
            this.tempVector.z += this.pos.z;

            //check if the player can move in X or Z direction separetly to allow sliding on the walls. Otherwise the player would get stuck when close to a wall
            //which would be very annoying. If the player can move to the new position then transform the current position to that position.
            if (this.canMove(game,this.tempVector.x,this.pos.y, this.pos.z)==null && this.canMove(game,this.tempVector.x,this.pos.y+1, this.pos.z)==null) this.pos.x += this.tempVector.x-this.pos.x;
            if (this.canMove(game,this.pos.x,this.pos.y,this.tempVector.z)==null && this.canMove(game,this.pos.x,this.pos.y+1,this.tempVector.z)==null) this.pos.z += this.tempVector.z-this.pos.z;
        }
        var increasedFallSpeed = (this.timeFallen)+1;
        this.tempVector.y = this.pos.y - (increasedFallSpeed/60);
        var groundBlock = this.onGround(game,this.tempVector.y);
        if (!groundBlock && !this.jump){
            this.pos.y += this.tempVector.y-this.pos.y;
            this.timeFallen++;
        }else{
            if (!this.jump){
                this.timeFallen = 0;
                this.pos.y = groundBlock.y;
            }
            if(game.input.firePressed && !this.jump){
                this.jumpAngle = 0;
                this.jump = true;
            }
        }
        

        game.camera.setPos(this.pos);
    }

    render(game,interpolationOffset){
        
    }

    

 

}

export default Player;