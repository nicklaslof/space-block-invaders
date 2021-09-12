import Invader from "../entity/invader.js";
import Particle from "../entity/particle.js";
import Player from "../entity/player.js";
import Chunk from "./chunk.js";
import * as SimplexNoise from '../lib/noise.js';

class World{
    constructor(game, sizeX, sizeZ) {
        this.sizeX = sizeX;
        this.sizeZ = sizeZ;
        this.chunks = [];
        this.entities = [];
        this.particles = [];
        this.noise = new SimplexNoise.SimplexNoise();
        this.noise2 = new SimplexNoise.SimplexNoise();
        this.noise3 = new SimplexNoise.SimplexNoise();
        this.spawnNewInvaderCounter = 400;

        // Loop over the size of the world and create every chunk.
        for (let x = 0; x < sizeX*16; x+=16) {
            for (let z = 0; z < sizeZ*16; z+=16) {
                var chunk = new Chunk(game, {x:x,z:z},this.noise,this.noise2,this.noise3);
                console.log("added chunk "+x+ " "+z+" at "+ " ");
                this.chunks[x/16 + ((z/16)*sizeX)]=chunk;     
            }
        }

        // When all chunks have been created, loop over them to add decorations. The chunks bordering to the end of the world will not have decorations otherwise there would be trees cut in half
        this.chunks.forEach(c => {
            if (c.chunkPos.x > 1 && c.chunkPos.x < sizeX-1 && c.chunkPos.z > 1 && c.chunkPos.z < sizeZ-1)
            c.buildDecoration(game,this,this.noise,this.noise2,this.noise3);
            else console.log(c.worldPos);
        });

        // Now when all blocks have been placed fill the level with sunlight
        this.chunks.forEach(c => {
            c.fillSunlight(game,this);
        });

        // Recalculate each Mesh at the end. (In this stage it's the first mesh built)
        this.chunks.forEach(c => {
            c.recalculateMesh(game,this); 
        });


        // Find a spawn position for the player where the player is on the ground with no surronding blocks blocking the movement
        var spawnPosition = null;
        var spawnTimeout = 1500;
        while(spawnPosition == null && spawnTimeout > 0){
            spawnTimeout--;
            var x = game.getRandomInt(2,sizeX-2);
            var z = game.getRandomInt(2,sizeZ-2);
            //console.log(x + " "+z);

            var c = this.chunks[x + (z*this.sizeX)];
          //  console.log(c.worldPos);
            loop:for (let x = 0; x < 16; x++) {

                for (let z = 0; z < 16; z++) {
                    for (let y = 0; y < 64; y++) {
                        var b = c.getBlockAt(x,y,z);
                        var b1 = c.getBlockAt(x,y+1,z);
                        var b2 = c.getBlockAt(x+1,y+1,z);
                        var b3 = c.getBlockAt(x-1,y+1,z);
                        var b4 = c.getBlockAt(x,y+1,z+1);
                        var b5 = c.getBlockAt(x,y+1,z-1);
                        if (b == "g" && b1 == null && b2 == null && b3 == null && b4 == null && b5 == null){
                            spawnPosition = {x:c.worldPos.x+x,y:y+1,z:c.worldPos.z+z};
                            console.log(spawnPosition);
                            break loop;
                        }
                    }
                }
            }
        }
        if (spawnPosition == null) console.log("no spawn found");
        this.player = new Player(spawnPosition.x,spawnPosition.y,spawnPosition.z);
        this.entities.push(this.player);
    }

    tick(game){


        // Spawn new invaders
        if (this.spawnNewInvaderCounter <0){
            this.spawnNewInvaderCounter = 1400;
            this.entities.push(new Invader(game,game.getRandomFloat(16,(this.sizeX*16)-16),40,game.getRandomFloat(16,(this.sizeZ*16)-16)));

        }else{
            this.spawnNewInvaderCounter--;
        }

        this.chunks.forEach(c => {
           c.tick(game);
       });

       // Tick entities and check collisions
        this.entities.forEach(e => {
            e.tick(game);
            // This is very inefficent. Should just check surrounding areas
            this.entities.forEach(e2 =>{
                if (e2 != e){
                    var collides = e2.doesCollide(e);
                    if (collides){
                        //console.log(collides);
                        e.onCollision(game,this,e2);
                    }
                }
                
            });
            if (e.disposed) this.removeEntity(e);
        });

        // Tick particles separetly to avoid collision checking
        this.particles.forEach(p => {
            p.tick(game);
            if (p.disposed) this.removeParticle(p);
        });
    }

    render(game,interpolationOffset){
        this.chunks.forEach(c => {
            c.render(game);
        });

        this.entities.forEach(e => {
            e.render(game,interpolationOffset);
        });

        this.particles.forEach(p => {
            p.render(game,interpolationOffset);
        });
    }

    // Get chunk based on world position. Floor it and divde by 16 to get the chunk position which is not the same as the worldposition (it's fixed to every 16x16 block)
    getChunk(x,z){
        var chunkX = Math.floor(x/16);
        var chunkZ = Math.floor(z/16);
        return this.chunks[chunkX + (chunkZ*this.sizeX)];
    }

    // Find the chunk from the world position and set the block in that chunk
    setBlockAt(game, x,y,z,block,update=true){

        var chunk = this.getChunk(x,z);
        if (chunk == null) return false;
        var localBlockPosX = x&15;
        var localBlockPosZ = z&15;

        chunk.setBlockAt(localBlockPosX,Math.round(y),localBlockPosZ,block);
        if (update){
            chunk.update(game,this);
            if (localBlockPosX==15 && this.getChunk(x+1,z) != null) this.getChunk(x+1,z).update(game,this);
            if (localBlockPosX==0 && this.getChunk(x-1,z) != null) this.getChunk(x-1,z).update(game,this);
            if (localBlockPosZ==15 && this.getChunk(x,z+1) != null) this.getChunk(x,z+1).update(game,this);
            if (localBlockPosZ==0 && this.getChunk(x,z-1) != null) this.getChunk(x,z-1).update(game,this);
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

    addParticle(game,x,y,z,direction,ttl,c=[0.8,0.3,0.3,1.0],size=0.1,speed=0.3){
        this.particles.push(new Particle(game,x,y,z,direction,ttl,c,size,speed));
    }

    removeEntity(entity){
        this.removeFromList(entity,this.entities);
    }

    removeParticle(particle){
        this.removeFromList(particle,this.particles);
    }

    removeFromList(object,list){
        for(let i = list.length - 1; i >= 0; i--) {
            if(list[i] === object) {
                list.splice(i, 1);
            }
        }
    }

    // Actually not used.. Was used in my exeperiment of how much a minecraft clone could be done within 13kb
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