import Entity from "./entity.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
// A bullet the player or an Invader shoots
class Bullet extends Entity{
    constructor(game, x, y, z, direction,c=[5.0,5.0,5.0,5.0],size=0.1) {
        super(x,y,z);
        this.type = "b"; // Silly quick way to check for entity types when doing collisions
        this.ttl = 100; // The life length of the bullet
        this.direction = direction; // The direction of the bullet
        this.texture = new Texture(game.glTexture.tex,72,6,14,14); // The texture atlas location
        var m = MeshBuilder.start(game.gl,x,y,z,size); // Create a Mesh with the specified size
        this.c = c;
        this.addBox(m,x,y,z,this.texture);

        this.mesh = MeshBuilder.build(m);
        this.mesh.updateMesh();
        this.sizeX = 1;
        this.sizeY = 1;
        this.sizeZ = 1;
        this.sourceEntityType = "";  // Can be set by the entity shooting the bullet. Is used in collisions to determinate if bullet should hurt or not (prevents Invaders to shoot eachother or themselves)
        this.speed = 1;
    }

    tick(game){
        super.tick(game);
        // Check where this bullet is moving and if it's colliding with the world.
        this.tempVector.x = this.tempVector.y = this.tempVector.z = 0;
        this.tempVector.x += this.pos.x + (this.direction.x*this.speed);
        this.tempVector.y += this.pos.y + (this.direction.y*this.speed);
        this.tempVector.z += this.pos.z + (this.direction.z*this.speed);
        var v = this.canMove(game,this.tempVector.x,this.tempVector.y,this.tempVector.z);
       
        // No block collisions. Continue moving
        if (v == null){
            this.pos.x = this.tempVector.x;
            this.pos.y = this.tempVector.y;
            this.pos.z = this.tempVector.z;
        }else{
            // We did hit a block. Dispose the bullet and add particles plus destroy the block. If it's an invader bullet do more damage.
            this.disposed = true;
            // Stop us from falling out trough the bottom of the world
            if (v.y < 2) return;
           // if (this.sourceEntityType == "i"){
            for (let i = 0; i < game.getRandomInt(1,2); i++) {
               game.world.addParticle(game,game.getRandomFloat(this.pos.x-1,this.pos.x+1),this.pos.y,game.getRandomFloat(this.pos.z-1,this.pos.z+1),{x:game.getRandomFloat(-1,1),y:game.getRandomFloat(-1,1),z:game.getRandomFloat(-1,1)},120,[0.8,0.8,0.0,1.0],0.05,0.05);
            }
                game.world.setBlockAt(game,v.x,v.y-1,v.z,null,true);
                if (this.sourceEntityType == "i"){
                    game.world.setBlockAt(game,v.x+1,v.y,v.z,null,true);
                    game.world.setBlockAt(game,v.x-1,v.y,v.z,null,true);
                    game.world.setBlockAt(game,v.x,v.y,v.z-1,null,true);
                    game.world.setBlockAt(game,v.x,v.y,v.z+1,null,true);
                    game.world.setBlockAt(game,v.x,v.y-2,v.z,null,true);
                }
           // }
            
        }
        this.ttl--;

        if (this.ttl <= 0) this.disposed = true;
    }

    render(game, interpolationOffset){
       // console.log("hehu");
        super.render(game,interpolationOffset);
    }

    
}

export default Bullet;