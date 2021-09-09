import Player from "../entity/player.js";
import Chunk from "./chunk.js";

class World{
    constructor(game, sizeX, sizeZ) {
        this.chunks = [];
        this.entites = [];
        this.noise = new SimplexNoise();
        this.noise2 = new SimplexNoise();

        for (let x = 0; x < sizeX*16; x+=16) {
            for (let z = 0; z < sizeZ*16; z+=16) {
                this.chunks.push(new Chunk(game, {x:x,z:z},this.noise,this.noise2));       
            }
        }

        this.entites.push(new Player(0,4,0));
    }

    tick(game, deltaTime){
        this.chunks.forEach(c => {
           c.tick(game,deltaTime);
       });

        this.entites.forEach(e => {
            e.tick(game,deltaTime);
        });

    }

    render(game){
        this.chunks.forEach(c => {
            c.render(game);
        });

        this.entites.forEach(e => {
            e.render(game);
        });
    }

    getChunk(x,z){
        var chunkX = Math.floor(x/16);
        var chunkZ = Math.floor(z/16);
       // console.log(chunkX+"("+x+") "+chunkZ+"("+z+")");
        var chunk;
        this.chunks.forEach(c => {
            if (c.chunkPos.x == chunkX && c.chunkPos.z == chunkZ) chunk = c;
        });
        return chunk;
    }

    setBlockAt(game, x,y,z,block){
        console.log("Trying setting block at "+x+" "+Math.round(y)+" "+z);
        var chunk = this.getChunk(x,z);
        if (chunk == null) return false;
        var localBlockPosX = x&15;
        var localBlockPoxZ = z&15;
        console.log("Setting block at "+localBlockPosX+" "+Math.round(y)+" "+localBlockPoxZ);
        chunk.setBlockAt(localBlockPosX,Math.round(y),localBlockPoxZ,block);
        chunk.update(game);
    }

    rayPickBlock(game,x,y,z,direction,range){
        var rayPosition = {x:x,y:y,z:z};
        for (let i = 0; i < range; i++) {
            rayPosition.x -= direction.x/2;
            rayPosition.y -= direction.y/2;
            rayPosition.z -= direction.z/2;

            var chunk = this.getChunk(rayPosition.x,rayPosition.z);
            if (chunk == null) continue;
            var localBlockPosX = rayPosition.x&15;
            var localBlockPoxZ = rayPosition.z&15;

            var blockId = chunk.getBlockAt(localBlockPosX,Math.round(rayPosition.y),localBlockPoxZ);
            var block = game.blocks.get(blockId);
            if (block == null) continue;

            var blockPos = {x:chunk.worldPos.x+localBlockPosX,y:Math.round(rayPosition.y),z:chunk.worldPos.z+localBlockPoxZ};
            var rayAABB = {minX:rayPosition.x-0.5,minY:rayPosition.y-0.5,minZ:rayPosition.z-0.5,maxX:rayPosition.x+0.5,maxY:rayPosition.y+0.5,maxZ:rayPosition.z+0.5};

            var intersects = block.intersects(blockPos,rayAABB);
            if (intersects) return blockPos;
        }

        return null;

    }

}

export default World;