import Bullet from "./bullet.js";
import Entity from "./entity.js";
const up = {x:0,y:1,z:0};
const down = {x:0,y:-1,z:0}
class Player extends Entity{

    constructor(xPos, yPos, zPos) {
        super(xPos,yPos,zPos);
        this.type = "p";
        this.velocity = {x:0,z:0};
        this.strafe = {x:0,z:0};
        
        this.jump = false;
        this.jumpCounter = 0;
        this.timeFallen = 0;
        this.speed = 0.25;
        this.shootDelay = 0;
        this.health = 5;
        this.hitCounter = 0;
    }

    tick (game){
        super.tick(game);
        this.hitCounter--;
        this.velocity.x = 0;
        this.velocity.z = 0;
        this.strafe.x = 0;
        this.strafe.z = 0;
        if (this.shootDelay>0)this.shootDelay--;

        // If player is in the air and jumping
        if (this.jump){
            this.jumpAngle += 0.144;
            // Use sin to move the player up and back down again
            var j = Math.sin(this.jumpAngle);

            this.tempVector.y = this.pos.y += j/4;

            var b = this.canMove(game,this.pos.x,this.tempVector.y,this.pos.z);
            // Check if the player can move to the specified position.  (Checking up is diabled to allow jumping up in trees to speed up the movements)
            if (b == null) this.pos.y += this.tempVector.y - this.pos.y;
            else{
                // If we collided with something (on the Y axis) fix the player position to that block and disable jump
                this.pos.y = b.y;
                this.jump = false;
            }
            //If we have done a full jump up and back down disable jump
            if (this.jumpAngle >= (Math.PI*2)) this.jump = false;
        }


        // Rotate the camera based on mouse input
        game.camera.rotate((game.input.getMouseX()/9) * 0.016);
        game.camera.rotateX((game.input.getMouseY()/9) * 0.016);

        // The direction the camera is facing. Used for getting strafing right and also for shooting bullets in the correct direction
        let cameraDirection = game.camera.getDirection();

        this.velocity.z = game.input.axes.y;

        // Strafe the player left right based on the direction the camera is facing
        if (game.input.axes.x < 0) this.cross(this.strafe,cameraDirection,up);
        if (game.input.axes.x > 0) this.cross(this.strafe,cameraDirection,down);

        // Shoot a bullet in the direction the camera is facing.
        if (game.input.getLeftClicked() && this.shootDelay <=0){
            var invertedCameraDirection = {x:-cameraDirection.x,y:-cameraDirection.y,z:-cameraDirection.z};
            //console.log(this.pos);
            game.playPlayerShoot();
            var b = new Bullet(game,this.pos.x+(invertedCameraDirection.x*1)+0.2,this.pos.y+1.2+(invertedCameraDirection.y*1)+0.2,this.pos.z+(invertedCameraDirection.z*1),invertedCameraDirection);
            b.sourceEntityType = this.type;
            game.world.addEntity(b);
            this.shootDelay = 10;
        }

        if (this.velocity.x !=0 || this.velocity.z != 0 || this.strafe.x != 0 || this.strafe.z !=0){
            //combine forward/backward movement with strafe movement and multiply that with the direction the camera is facing
            this.tempVector.x = cameraDirection.x * this.velocity.z + this.strafe.x;
            this.tempVector.z = cameraDirection.z * this.velocity.z + this.strafe.z;
            this.tempVector.y = 0;
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

        // Always check if the player can fall down. Also increase the fall speed the longer in the air.
        var increasedFallSpeed = (this.timeFallen)+1;
        if (this.timeFallen >0) console.log(this.timeFallen);
        this.tempVector.y = this.pos.y - (Math.min(increasedFallSpeed,40)/60);

        // Check if we are on ground or not (colliding with a block in the direction moving down)
        var groundBlock = this.onGround(game,this.tempVector.y);
        if (!groundBlock && !this.jump){
            // if no collisions move the player down in the Y axis
            this.pos.y += this.tempVector.y-this.pos.y;
            this.timeFallen++;
        }else{
            // If we are not jumping fix the player to the block we just did hit.
            if (!this.jump){
                this.timeFallen = 0;
                this.pos.y = groundBlock.y;
            }
            // If we are on ground and not already jumping check for player jump input.
            if(game.input.firePressed && !this.jump){
                this.jumpAngle = 0;
                this.jump = true;
            }
        }
        


    }

    render(game,interpolationOffset){
        super.render(game,interpolationOffset);
        // Set the camera position matching the player
        game.camera.setPos(this.interpolatedPos);
    }

    onCollision(game,world,e){

        // If player is hit reduce the health
        if (e.type == this.type || e.sourceEntityType == this.type) return;
        if (this.hitCounter <= 0){
            for (let i = 0; i < game.getRandomInt(5,10); i++) {
                world.addParticle(game,game.getRandomFloat(this.pos.x-1,this.pos.x+2),game.getRandomFloat(this.pos.y,this.pos.y+8),game.getRandomFloat(this.pos.z,this.pos.z+12),{x:0,y:-1,z:0},120);
            }
            this.hitCounter = 40;
            this.health--;
            game.playPlayerHit();
        }
    }


 

}

export default Player;