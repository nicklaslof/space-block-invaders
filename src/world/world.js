import Invader from "../entity/invader.js";
import Player from "../entity/player.js";
import Chunk from "./chunk.js";

class World{
    constructor(game, sizeX, sizeZ) {
        this.sizeX = sizeX;
        this.sizeZ = sizeZ;
        this.chunks = [];
        this.entities = [];
        this.noise = new SimplexNoise();
        this.noise2 = new SimplexNoise();
        this.noise3 = new SimplexNoise();

        for (let x = 0; x < sizeX*16; x+=16) {
            for (let z = 0; z < sizeZ*16; z+=16) {
                var chunk = new Chunk(game, {x:x,z:z},this.noise,this.noise2,this.noise3);
                console.log("added chunk "+x+ " "+z+" at "+ " ");
                this.chunks[x/16 + ((z/16)*sizeX)]=chunk;     
            }
        }

        this.chunks.forEach(c => {
            c.buildDecoration(game,this,this.noise,this.noise2,this.noise3);
        });

        this.chunks.forEach(c => {
            c.fillSunlight(game,this);
        });
        this.chunks.forEach(c => {
            c.recalculateMesh(game,this); 
        });

        this.entities.push(new Player(48,64,48));
        for (let i = 0; i < 30; i++) {
            this.entities.push(new Invader(game,game.getRandomInt(0,128),55,game.getRandomInt(0,128)));
        }
        
    }

    tick(game){
        this.chunks.forEach(c => {
           c.tick(game);
       });

        this.entities.forEach(e => {
            e.tick(game);
            if (e.disposed) this.removeEntity(e);
        });
    }

    render(game,interpolationOffset){
        this.chunks.forEach(c => {
            c.render(game);
        });

        this.entities.forEach(e => {
            e.render(game,interpolationOffset);
        });
    }

    getChunk(x,z){
        var chunkX = Math.floor(x/16);
        var chunkZ = Math.floor(z/16);
        return this.chunks[chunkX + (chunkZ*this.sizeX)];
    }

    setBlockAt(game, x,y,z,block,update=true){

        var chunk = this.getChunk(x,z);
        if (chunk == null) return false;
        var localBlockPosX = x&15;
        var localBlockPosZ = z&15;

        chunk.setBlockAt(localBlockPosX,Math.round(y),localBlockPosZ,block);
        if (update){
            chunk.update(game,this);
            if (localBlockPosX==15) this.getChunk(x+1,z).update(game,this);
            if (localBlockPosX==0) this.getChunk(x-1,z).update(game,this);
            if (localBlockPosZ==15) this.getChunk(x,z+1).update(game,this);
            if (localBlockPosZ==0) this.getChunk(x,z-1).update(game,this);
        }
    }

    getBlockAt(x,y,z){
        var chunk = this.getChunk(x,z);
        if (chunk == null) return null;
        var localBlockPosX = x&15;
        var localBlockPoxZ = z&15;
        return chunk.getBlockAt(localBlockPosX,y,localBlockPoxZ);

    }

    getLightAt(x,y,z){
        var chunk = this.getChunk(x,z);
        if (chunk == null) return 0;
        var localBlockPosX = x&15;
        var localBlockPoxZ = z&15;
        return chunk.getLightAt(localBlockPosX,y,localBlockPoxZ);

    }

    addEntity(entity){
        this.entities.push(entity);
    }

    removeEntity(entity){
        this.removeFromList(entity,this.entities);
    }

    removeFromList(object,list){
        for(let i = list.length - 1; i >= 0; i--) {
            if(list[i] === object) {
                list.splice(i, 1);
            }
        }
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