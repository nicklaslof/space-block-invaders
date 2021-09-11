import Entity from "./entity.js";
import MeshBuilder from "../gl/meshbuilder.js";
import Texture from "../gl/texture.js";
class Bullet extends Entity{
    constructor(game, x, y, z, direction) {
        super(x,y,z);
       // console.log("bullet at "+this.pos.x+" "+this.pos.y+" "+this.pos.z);
        this.type = "b";
        this.ttl = 100;
        this.direction = direction;
        this.texture = new Texture(game.glTexture.tex,16,16,16,16);
        var m = MeshBuilder.start(game.gl,x,y,z);
        this.c = [5.0,5.0,5.0,5.0];
        this.addBox(m,x,y,z,this.texture);

        this.mesh = MeshBuilder.build(m);
        this.mesh.updateMesh();
        this.sizeX = 1;
        this.sizeY = 1;
        this.sizeZ = 1;
        this.sourceEntityType = "";
        this.speed = 1;
    }

    tick(game){
        super.tick(game);
        this.tempVector.x = this.tempVector.y = this.tempVector.z = 0;
        this.tempVector.x += this.pos.x + (this.direction.x*this.speed);
        this.tempVector.y += this.pos.y + (this.direction.y*this.speed);
        this.tempVector.z += this.pos.z + (this.direction.z*this.speed);
        var v = this.canMove(game,this.tempVector.x,this.tempVector.y,this.tempVector.z);
       // console.log(v);
        if (v == null){
            this.pos.x = this.tempVector.x;
            this.pos.y = this.tempVector.y;
            this.pos.z = this.tempVector.z;
        }else{
           // if (this.sourceEntityType == "i"){
                game.world.setBlockAt(game,v.x,v.y-1,v.z,null,true);
           // }
            this.disposed = true;
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