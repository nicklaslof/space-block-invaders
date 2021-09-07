import Chunk from "./chunk.js";

class World{
    constructor(game, sizeX, sizeZ) {
        this.chunks = [];
        this.noise = new SimplexNoise();
        this.noise2 = new SimplexNoise();

        for (let x = 0; x < sizeX*16; x+=16) {
            for (let z = 0; z < sizeZ*16; z+=16) {
                this.chunks.push(new Chunk(game, {x:x,z:z},this.noise,this.noise2));       
            }
        }
    }

    tick(game, deltaTime){
       this.chunks.forEach(c => {
           c.tick(game,deltaTime);
       });
    }

    render(game){
        this.chunks.forEach(c => {
            c.render(game);
        });
    }

    getChunk(x,z){
        var chunkX = Math.floor(x/16);
        var chunkZ = Math.floor(z/16);
        //console.log(chunkX+"("+x+") "+chunkZ+"("+z+")");
        var chunk;
        this.chunks.forEach(c => {
            if (c.chunkPos.x == chunkX && c.chunkPos.z == chunkZ) chunk = c;
        });
        return chunk;
    }

}

export default World;