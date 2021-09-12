import Entity from "./entity.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";

class Particle extends Entity{
    constructor(game,x,y,z,direction,ttl,c,size,speed){
        super(x,y,z);
        this.speed = speed;
        this.texture = new Texture(game.glTexture.tex,72,6,14,14);
        var m = MeshBuilder.start(game.gl,x,y,z,size);
        this.c = c;
        
        this.addBox(m,x,y,z,this.texture);

        this.mesh = MeshBuilder.build(m);
        this.mesh.updateMesh();

        this.direction = direction;
        this.ttl = ttl;
    }

    tick(game){
        // Moves the particle in the direction and speed. If it has reached the end of it's life dispose it
        super.tick(game);
        this.ttl--;

        if (this.ttl < 0) this.disposed = true;

        this.pos.x += this.direction.x*this.speed;
        this.pos.y += this.direction.y*this.speed;
        this.pos.z += this.direction.z*this.speed;
    }
}
export default Particle;