import Entity from "./entity.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Bullet from "./bullet.js";

class Invader extends Entity{

    constructor(game, x, y, z) {
        super(x,y,z);
        this.type = "i";
        this.bulletColor = [0.5,0.5,1.0,1.0];
        this.hitColor = [0.8,0.3,0.3,1.0];
        this.particleDirection = {x:0,y:-1,z:0};
        this.health = 5;
     
        this.hitCCountDown = 0;
        this.changeBackCAfterHit = false;
        this.hitCounter = 0;
        this.shootCounter = 0;
     
        this.texture = new Texture(game.glTexture.tex,72,6,14,14);

        // Build the Invader look by adding boxes
        var m = MeshBuilder.start(game.gl,x,y,z);

        this.c = this.baseColor = [1.0,1.0,0.0,0.1];
        this.addBox(m,0,6,3,this.texture);
        this.addBox(m,0,6,9,this.texture);
        this.addBox(m,0,5,4,this.texture);
        this.addBox(m,0,5,8,this.texture);
        for (let i = 3; i < 10; i++) this.addBox(m,0,5,i,this.texture);
     
            

        this.addBox(m,0,4,2,this.texture);
        this.addBox(m,0,4,3,this.texture);

        this.addBox(m,0,4,5,this.texture);
        this.addBox(m,0,4,6,this.texture);
        this.addBox(m,0,4,7,this.texture);

        this.addBox(m,0,4,9,this.texture);
        this.addBox(m,0,4,10,this.texture);

        for (let i = 1; i < 12; i++) this.addBox(m,0,3,i,this.texture);

        this.addBox(m,0,3,1,this.texture);
        for (let i = 3; i < 10; i++) this.addBox(m,0,3,i,this.texture);
        this.addBox(m,0,3,11,this.texture);

        this.addBox(m,0,2,1,this.texture);
        this.addBox(m,0,2,3,this.texture);

        this.addBox(m,0,2,9,this.texture);
        this.addBox(m,0,2,11,this.texture);

        this.addBox(m,0,1,4,this.texture);
        this.addBox(m,0,1,5,this.texture);

        this.addBox(m,0,1,7,this.texture);
        this.addBox(m,0,1,8,this.texture);

        this.mesh = MeshBuilder.build(m);
        this.mesh.setPos(x, y, z);
        this.mesh.updateMesh();
        

        this.counter = 0;
        this.playerShootCounter = 0;

        this.sizeX = 1;
        this.sizeY = 6;
        this.sizeZ = 12;
    }

    tick(game){
        super.tick(game);
        this.hitCounter--;

        // Make the invader to shift to red when hit. Unfortunatly I couldnt get the mesh to change color..  I'm not sure why :( it used to work before...
        if (this.hitCCountDown>0) this.hitCCountDown--;
        if (this.changeBackCAfterHit && this.hitCCountDown <= 0){
            this.setC(this.baseColor);
            this.changeBackCAfterHit = false;
        }

        this.counter++;
        var v = Math.sin(this.counter/30);
        this.pos.z += v/5;
        this.playerShootCounter--;

        if (this.shootCounter <0){
            // Limit shooting to once every second
            this.shootCounter = 240;
            var b = new Bullet(game,this.pos.x,this.pos.y+2,this.pos.z+6,{x:0,y:-1,z:0});
            b.speed = 0.5;
            b.sourceEntityType = this.type;
            game.world.addEntity(b);
            var distanceToPlayer = this.distanceToOtherEntity(game.world.player);
            var volume = (game.world.sizeX*16) - distanceToPlayer;
            volume /= game.world.sizeX*16;
            if (volume > 0.8) volume *= 1.5;
            if (volume < 0.5) volume *= 0.75;
            volume = Math.max(0.1,Math.min(1.5,volume));
            game.playInvaderShooting(volume); // Set the volume based on distance to the player


            

        }else{
            this.shootCounter--;
        }

        if (distanceToPlayer < 40 && this.playerShootCounter < 0){
            // Aim and shoot a big bullet at the player every 2 second
            this.playerShootCounter = 120;
            var direction = {x:game.world.player.pos.x - this.pos.x, y: game.world.player.pos.y - this.pos.y, z: game.world.player.pos.z - (this.pos.z+6)};
            this.normalize(direction);
            console.log(direction);
            var b = new Bullet(game,this.pos.x,this.pos.y,this.pos.z+6,direction,this.bulletColor,1);
            b.speed = 0.8;
            b.sourceEntityType = this.type;
            b.sizeX = b.sizeY = 4;
            game.world.addEntity(b);
        }

    }

    render(game,interpolationOffset){
        super.render(game,interpolationOffset,false);
        // For some reason the color change doesn't work..   I spent an hour but can't find the reason.. it worked in my entry last year using the same code in the mesh class.
        this.mesh.render(game.gl,game.shaderProgram,game.camera.perspectiveMatrix,game.glTexture,game.world.player.hitCounter>1?1:0,null,this.colorChanged?[this.c, this.c, this.c, this.c]:null);
        this.colorChanged = false;
    }
    
    setC(c){
        this.c = c;
        this.colorChanged = true;
    }

    onCollision(game,world,e){
        // Invader collided with an entity.
        super.onCollision(game, world,e);
        if (e.type == this.type || e.sourceEntityType == this.type) return;
        if (this.hitCounter <= 0){
            for (let i = 0; i < game.getRandomInt(5,10); i++) {
                world.addParticle(game,game.getRandomFloat(this.pos.x-1,this.pos.x+2),game.getRandomFloat(this.pos.y,this.pos.y+8),game.getRandomFloat(this.pos.z,this.pos.z+12),this.particleDirection,120,this.hitColor,0.25);
            }
            this.setC([0,0,0,1]);
            this.hitCCountDown = 40;
            this.changeBackCAfterHit = true;
            this.hitCounter = 40;
            this.health--;
            game.playerInvaderHit();
        }

        //this.disposed = true;
    }

    onDisposed(game){
        game.playInvaderDied();
        for (let i = 0; i < game.getRandomInt(5,10); i++) {
            game.world.addParticle(game,game.getRandomFloat(this.pos.x-1,this.pos.x+2),game.getRandomFloat(this.pos.y,this.pos.y+8),game.getRandomFloat(this.pos.z,this.pos.z+12),
            {x:game.getRandomFloat(-1,1),y:game.getRandomFloat(-1,0),z:game.getRandomFloat(-1,1)},120,this.hitColor,0.25);
        }
    }

}

export default Invader;