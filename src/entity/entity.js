class Entity {
    constructor(posX, posY, posZ) {
        this.pos = {x:posX, y:posY, z:posZ};
        this.speed = 8;
        
    }

    tick (game, deltaTime){

    }

    render(game){

    }

    canMove(game, x,y,z){
        y = y + 2;
        var radius = 0.4;
        let x1 = Math.round(x + radius);
        let z1 = Math.round(z + radius);
        let x2 = Math.round(x - radius);
        let z2 = Math.round(z - radius);


        if (this.checkIntersects(game, x1,y,z1)) return false;
        if (this.checkIntersects(game, x2,y,z1)) return false;
        if (this.checkIntersects(game, x1,y,z2)) return false;
        if (this.checkIntersects(game, x2,y,z2)) return false;


        return true;
    }

    checkIntersects(game, x,y,z){
        // console.log("y:"+y);
            var chunk = game.world.getChunk(x,z);
            if (chunk == null) return false;
            var localBlockPosX = x&15;
            var localBlockPoxZ = z&15;
            var blockId = chunk.getBlockAt(localBlockPosX,Math.round(y),localBlockPoxZ);
            var block = game.blocks.get(blockId);
            if (block == null) return false;
            var blockPos = {x:chunk.worldPos.x+localBlockPosX,y:y,z:chunk.worldPos.z+localBlockPoxZ};
            var cameraAABB = {minX:x,minY:y,minZ:z,maxX:x+1,maxY:y+1.6,maxZ:z+1};
            var intersects = block.intersects(blockPos,cameraAABB);
            if (intersects) return true;
            return false;
        }

    onGround(game,y){
        if (this.canMove(game, this.pos.x,y,this.pos.z)) return false;
        return true;
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