import Entity from "./entity.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";

class Particle extends Entity{
    constructor(game,x,y,z,direction,ttl,c){
        super(x,y,z);
        this.texture = new Texture(game.glTexture.tex,71,5,16,16);
        var m = MeshBuilder.start(game.gl,x,y,z);
        this.c = c;
        
        this.addBox(m,x,y,z,this.texture);

        this.mesh = MeshBuilder.build(m);
        this.mesh.updateMesh();

        this.direction = direction;
        this.ttl = ttl;
    }

    tick(game){
        super.tick(game);
        this.ttl--;

        if (this.ttl < 0) this.disposed = true;

        this.pos.x += this.direction.x/3;
        this.pos.y += this.direction.y/3;
        this.pos.z += this.direction.z/3;
    }
}
export default Particle;