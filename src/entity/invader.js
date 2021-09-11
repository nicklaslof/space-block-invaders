import Entity from "./entity.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";

class Invader extends Entity{

    constructor(game, x, y, z) {
        super(x,y,z);
        this.type = "i";
        this.texture = new Texture(game.glTexture.tex,16,16,16,16);
        var m = MeshBuilder.start(game.gl,x,y,z);
        this.c = [1.0,0.3,0.3,1.0];
        this.addBox(m,x,y,z+3,this.texture);
        this.addBox(m,x,y,z+9,this.texture);
        this.addBox(m,x,y-1,z+4,this.texture);
        this.addBox(m,x,y-1,z+8,this.texture);
        for (let i = 3; i < 10; i++) this.addBox(m,x,y-2,z+i,this.texture); 
            

        this.addBox(m,x,y-3,z+2,this.texture);
        this.addBox(m,x,y-3,z+3,this.texture);

        this.addBox(m,x,y-3,z+5,this.texture);
        this.addBox(m,x,y-3,z+6,this.texture);
        this.addBox(m,x,y-3,z+7,this.texture);

        this.addBox(m,x,y-3,z+9,this.texture);
        this.addBox(m,x,y-3,z+10,this.texture);

        for (let i = 1; i < 12; i++) this.addBox(m,x,y-4,z+i,this.texture);

        this.addBox(m,x,y-5,z+1,this.texture);
        for (let i = 3; i < 10; i++) this.addBox(m,x,y-5,z+i,this.texture);
        this.addBox(m,x,y-5,z+11,this.texture);

        this.addBox(m,x,y-6,z+1,this.texture);
        this.addBox(m,x,y-6,z+3,this.texture);

        this.addBox(m,x,y-6,z+9,this.texture);
        this.addBox(m,x,y-6,z+11,this.texture);

        this.addBox(m,x,y-7,z+4,this.texture);
        this.addBox(m,x,y-7,z+5,this.texture);

        this.addBox(m,x,y-7,z+7,this.texture);
        this.addBox(m,x,y-7,z+8,this.texture);

        this.mesh = MeshBuilder.build(m);
        this.mesh.setPos(x, y, z);
        this.mesh.updateMesh();
        this.mesh.cleanUp();

        this.counter = 0;
    }

    tick(game){
        super.tick(game);
        this.counter++;
        var v = Math.sin(this.counter/30);

        this.pos.z += v/5;

    }

}

export default Invader;