class Entity {
    constructor(posX, posY, posZ) {
        this.pos = {x:posX, y:posY, z:posZ};
        this.previousPosition = {x:0, y:0, z:0};
        this.interpolatedPos = {x:0, y:0, z:0};
        this.speed = 0.1;
        
    }

    tick (game){
        this.previousPosition.x = this.pos.x;
        this.previousPosition.y = this.pos.y;
        this.previousPosition.z = this.pos.z;

    }

    render(game,interpolationOffset){
        this.interpolatedPos.x = this.previousPosition.x + (this.pos.x - this.previousPosition.x) * interpolationOffset;
        this.interpolatedPos.y = this.previousPosition.y + (this.pos.y - this.previousPosition.y) * interpolationOffset;
        this.interpolatedPos.z = this.previousPosition.z + (this.pos.z - this.previousPosition.z) * interpolationOffset;

        

        game.camera.setPos(this.interpolatedPos);

    }

    canMove(game, x,y,z){
        //y = y + 2;
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
            var cameraAABB = {minX:x,minY:y,minZ:z,maxX:x+0.8,maxY:y+1,maxZ:z+0.8};
            var intersects = block.intersects(blockPos,cameraAABB);
            if (intersects) return blockPos;
            return null;
        }

    onGround(game,y){
        return this.canMove(game, this.pos.x,y,this.pos.z);
        
    }


    //Vector cross product math of two vectors
    cross(out, a, b) {
        out.x = a.y * b.z - a.z * b.y;
        out.y = a.z * b.x - a.x * b.z;
        out.z = a.x * b.y - a.y * b.x;
        return out;
    }

    normalize(v) {
        let len = v.x * v.x + v.z * v.z;
        if (len > 0) {
          len = 1 / Math.sqrt(len);
        }
        v.x *= len;
        v.z *= len;
    }
}
export default Entity;