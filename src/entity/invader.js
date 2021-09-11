import Entity from "./entity.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
import Bullet from "./bullet.js";

class Invader extends Entity{

    constructor(game, x, y, z) {
        super(x,y,z);
        this.type = "i";

        this.health = 5;
     
        this.hitCCountDown = 0;
        this.changeBackCAfterHit = false;
        this.hitCounter = 0;
        this.shootCounter = 0;
     
        this.texture = new Texture(game.glTexture.tex,71,5,16,16);
        var m = MeshBuilder.start(game.gl,x,y,z);

        this.c = this.baseColor = [1.0,1.0,0.0,0.1];
        this.addBox(m,x,y+6,z+3,this.texture);
        this.addBox(m,x,y+6,z+9,this.texture);
        this.addBox(m,x,y+5,z+4,this.texture);
        this.addBox(m,x,y+5,z+8,this.texture);
        for (let i = 3; i < 10; i++) this.addBox(m,x,y+5,z+i,this.texture);
     
            

        this.addBox(m,x,y+4,z+2,this.texture);
        this.addBox(m,x,y+4,z+3,this.texture);

        this.addBox(m,x,y+4,z+5,this.texture);
        this.addBox(m,x,y+4,z+6,this.texture);
        this.addBox(m,x,y+4,z+7,this.texture);

        this.addBox(m,x,y+4,z+9,this.texture);
        this.addBox(m,x,y+4,z+10,this.texture);

        for (let i = 1; i < 12; i++) this.addBox(m,x,y+3,z+i,this.texture);

        this.addBox(m,x,y+3,z+1,this.texture);
        for (let i = 3; i < 10; i++) this.addBox(m,x,y+3,z+i,this.texture);
        this.addBox(m,x,y+3,z+11,this.texture);

        this.addBox(m,x,y+2,z+1,this.texture);
        this.addBox(m,x,y+2,z+3,this.texture);

        this.addBox(m,x,y+2,z+9,this.texture);
        this.addBox(m,x,y+2,z+11,this.texture);

        this.addBox(m,x,y+1,z+4,this.texture);
        this.addBox(m,x,y+1,z+5,this.texture);

        this.addBox(m,x,y+1,z+7,this.texture);
        this.addBox(m,x,y+1,z+8,this.texture);

        this.mesh = MeshBuilder.build(m);
        this.mesh.setPos(x, y, z);
        this.mesh.updateMesh();
        

        this.counter = 0;

        this.sizeX = 1;
        this.sizeY = 6;
        this.sizeZ = 12;
    }

    tick(game){
        super.tick(game);
        this.hitCounter--;
        if (this.hitCCountDown>0) this.hitCCountDown--;
        if (this.changeBackCAfterHit && this.hitCCountDown <= 0){
            this.setC(this.baseColor);
            this.changeBackCAfterHit = false;
        }

        this.counter++;
        var v = Math.sin(this.counter/30);
        this.pos.z += v/5;

        if (this.shootCounter <0){
            this.shootCounter = 120;
            var b = new Bullet(game,this.pos.x,this.pos.y+2,this.pos.z+6,{x:0,y:-1,z:0});
            b.speed = 0.5;
            b.sourceEntityType = this.type;
            game.world.addEntity(b);
            var distanceToPlayer = this.distanceToOtherEntity(game.world.player);
            var volume = (game.world.sizeX*16) - distanceToPlayer;
            volume /= game.world.sizeX*16;
            if (volume > 0.5) volume *= 1.5;
            if (volume < 0.5) volume *= 0.75;
            volume = Math.max(0.1,Math.min(2,volume));
            console.log(distanceToPlayer + " "+volume);
            //distanceToPlayer /= game.world.sizeX*80;
            //console.log(1.0-distanceToPlayer);

            game.playInvaderShooting(volume);
        }else{
            this.shootCounter--;
        }

    }

    render(game,interpolationOffset){
        super.render(game,interpolationOffset,false);
        // For some reason the color change doesn't work..   I spent an hour but can't find the reason.. it worked in my entry last year using the same code in the mesh class.
        this.mesh.render(game.gl,game.shaderProgram,game.camera.perspectiveMatrix,game.glTexture,0,null,this.colorChanged?[this.c, this.c, this.c, this.c]:null);
        this.colorChanged = false;
    }
    
    setC(c){
        this.c = c;
        this.colorChanged = true;
    }

    onCollision(game,world,e){
        super.onCollision(game, world,e);
        if (e.type == this.type || e.sourceEntityType == this.type) return;
        if (this.hitCounter <= 0){
            for (let i = 0; i < game.getRandomInt(5,10); i++) {
                world.addParticle(game,game.getRandomFloat(this.pos.x-1,this.pos.x+2),game.getRandomFloat(this.pos.y,this.pos.y+8),game.getRandomFloat(this.pos.z,this.pos.z+12),{x:0,y:-1,z:0},120);
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
            {x:game.getRandomFloat(-1,1),y:game.getRandomFloat(-1,0),z:game.getRandomFloat(-1,1)},120);
        }
    }

}

export default Invader;