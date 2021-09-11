import MeshBuilder from "../gl/meshbuilder.js";
class Entity {
    constructor(posX, posY, posZ) {
        this.pos = {x:posX, y:posY, z:posZ};
        this.previousPosition = {x:posX, y:posY, z:posZ};
        this.interpolatedPos = {x:0, y:0, z:0};
        this.tempVector = {x:0,y:0,z:0};
        this.speed = 0.1;
        this.disposed = false;
        this.tempAABB = {x:0,y:0,z:0};
        this.AABB = {minX:0,minY:0,minZ:0,maxX:0,maxY:0,maxZ:0};
        this.sizeX = 1;
        this.sizeY = 1;
        this.sizeZ = 1;
        this.health = 1;

        
    }

    tick (game){
        if (this.health<1){
            this.disposed = true;
            this.onDisposed(game);
        }
        this.previousPosition.x = this.pos.x;
        this.previousPosition.y = this.pos.y;
        this.previousPosition.z = this.pos.z;

        this.AABB.minX=this.pos.x;
        this.AABB.minY=this.pos.y;
        this.AABB.minZ=this.pos.z;
        this.AABB.maxX=this.pos.x+this.sizeX;
        this.AABB.maxY=this.pos.y+this.sizeY;
        this.AABB.maxZ=this.pos.z+this.sizeZ;

        if (this.hurtCounter >0) this.hurtCounter--;

    }

    render(game,interpolationOffset,render=true){
        if (this.disposed) return;
        this.interpolatedPos.x = this.previousPosition.x + (this.pos.x - this.previousPosition.x) * interpolationOffset;
        this.interpolatedPos.y = this.previousPosition.y + (this.pos.y - this.previousPosition.y) * interpolationOffset;
        this.interpolatedPos.z = this.previousPosition.z + (this.pos.z - this.previousPosition.z) * interpolationOffset;

        if (this.mesh != null){
            //if (this.type == "b") console.log(this.pos);
            this.mesh.setPos(this.interpolatedPos.x,this.interpolatedPos.y,this.interpolatedPos.z);

            if (render)this.mesh.render(game.gl,game.shaderProgram,game.camera.perspectiveMatrix,game.glTexture,game.world.player.hitCounter>1?1:0);
        
        }
    }

    canMove(game, x,y,z){
        //y = y + 2;
        this.tempAABB = {minX:x,minY:y,minZ:z,maxX:x+this.sizeX,maxY:y+this.sizeY,maxZ:z+this.sizeZ};
        var radius = 0.4;
        let x1 = Math.round(x + radius);
        let z1 = Math.round(z + radius);
        let x2 = Math.round(x - radius);
        let z2 = Math.round(z - radius);

        var b1 = this.checkIntersects(game, x1,y,z1);
        var b2 = this.checkIntersects(game, x2,y,z1);
        var b3 = this.checkIntersects(game, x1,y,z2);
        var b4 = this.checkIntersects(game, x2,y,z2);

        if (b1) return b1;
        if (b2) return b2;
        if (b3) return b3;
        if (b4) return b4;
        
    }

    checkIntersects(game, x,y,z){
        // console.log("y:"+y);
            var chunk = game.world.getChunk(x,z);
            if (chunk == null) return null;
            var localBlockPosX = x&15;
            var localBlockPoxZ = z&15;
            var blockId = chunk.getBlockAt(localBlockPosX,Math.floor(y),localBlockPoxZ);
            var block = game.blocks.get(blockId);
            if (block == null) return null;
            var blockPos = {x:chunk.worldPos.x+localBlockPosX,y:Math.abs(Math.ceil(y)),z:chunk.worldPos.z+localBlockPoxZ};
            
            var intersects = block.intersects(blockPos,this.tempAABB);
            if (intersects) return blockPos;
            return null;
        }

    onGround(game,y){
        return this.canMove(game, this.pos.x,y,this.pos.z);
        
    }

    doesCollide(e){
        if (e.AABB == null || this.AABB == null) return false;
        return (e.AABB.minX <= this.AABB.maxX && e.AABB.maxX >= this.AABB.minX) &&
         (e.AABB.minY <= this.AABB.maxY && e.AABB.maxY >= this.AABB.minY) &&
         (e.AABB.minZ <= this.AABB.maxZ && e.AABB.maxZ >= this.AABB.minZ);
    }

    onCollision(game,world, e){

    }

    onDisposed(game){
        
    }


    //Vector cross product math of two vectors
    cross(out, a, b) {
        out.x = a.y * b.z - a.z * b.y;
        out.y = a.z * b.x - a.x * b.z;
        out.z = a.x * b.y - a.y * b.x;
        return out;
    }

    normalize(v) {
        let len = v.x * v.x + v.y * v.y + v.z * v.z;
        if (len > 0) {
          len = 1 / Math.sqrt(len);
        }
        v.x *= len;
        v.y *= len;
        v.z *= len;
    }

    distance(v1, v2) {
        let x = v1.x - v2.x
        let z = v1.z - v2.z;
        return Math.hypot(x, z);
    }

    distanceToOtherEntity(entity){
        return this.distance(this.pos, entity.pos);
    }

    addBox(m,x,y,z,texture){
        MeshBuilder.top(texture.getUVs(),m,x,y,z,1,this.c,null);
        MeshBuilder.left(texture.getUVs(),m,x,y,z,0.8,1,this.c,null);
        MeshBuilder.right(texture.getUVs(),m,x,y,z,0.7,1,this.c,null);
        MeshBuilder.bottom(texture.getUVs(),m,x,y,z,1,this.c,null);
        MeshBuilder.front(texture.getUVs(),m,x,y,z,0.6,1,this.c,null);
        MeshBuilder.back(texture.getUVs(),m,x,y,z,1,0.8,this.c,null);
    }
}
export default Entity;