import MeshBuilder from "../gl/meshbuilder.js";
class Chunk{
    constructor(game, pos,noise,noise2,noise3) {
        this.worldPos = pos;
        this.chunkPos = {x:pos.x/16,z:pos.z/16};
        console.log("Creating chunk :"+pos.x+" "+pos.z+ "   "+this.chunkPos.x+"  "+this.chunkPos.z);

        this.blocks = [];
        this.lightMap = [];

        this.buildChunkWorld(game, noise, noise2,noise3);
        this.update(game);

    }

    fillSunlight(){

        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                for (let y = 0; y < 64; y++) {
                    this.setLightAt(x,y,z,0.7);
                }
            }
        }

        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
            height: for (let y = 64; y > 0; y--) {
                        var block = this.getBlockAt(x,y,z);
                        if (block == null) this.setLightAt(x,y,z,1);
                        else break height;
                     }
            }
        }
    }

    recalculateMesh(game) {
        this.mesh = null;
        var m = MeshBuilder.start(game.gl, this.worldPos.x, 0, this.worldPos.z);

        for (let x = 0; x < 16; x++) {

            for (let z = 0; z < 16; z++) {
                for (let y = 0; y < 64; y++) {
                    var blockId = this.getBlockAt(x, y, z);
                    if (blockId != undefined) {
                        var block = game.blocks.get(blockId);
                        if (this.getBlockAt(x, y + 1, z) == undefined)
                            MeshBuilder.top(block.topTexture.getUVs(), m, x, y, z, this.getLightAt(x,y+1,z), block.topColor);
                        if (this.getBlockAt(x - 1, y, z) == undefined)
                            MeshBuilder.left(block.sideTexture.getUVs(), m, x, y, z, this.getLightAt(x-1,y,z), 1, block.sideColor);
                        if (this.getBlockAt(x + 1, y, z) == undefined)
                            MeshBuilder.right(block.sideTexture.getUVs(), m, x, y, z, this.getLightAt(x+1,y,z), 1, block.sideColor);
                        if (this.getBlockAt(x, y, z + 1) == undefined)
                            MeshBuilder.front(block.sideTexture.getUVs(), m, x, y, z, this.getLightAt(x,y,z+1), 1, block.sideColor);
                        if (this.getBlockAt(x, y, z - 1) == undefined)
                            MeshBuilder.back(block.sideTexture.getUVs(), m, x, y, z, this.getLightAt(x,y,z-1), 1, block.sideColor);
                        if (this.getBlockAt(x, y - 1, z) == undefined)
                            MeshBuilder.bottom(block.sideTexture.getUVs(), m, x, y, z, this.getLightAt(x,y-1,z), block.sideColor);
                    }
                }
            }
        }


        this.mesh = MeshBuilder.build(m);
        this.mesh.setPos(this.worldPos.x, 0, this.worldPos.z);
        this.mesh.updateMesh();
        this.mesh.cleanUp();
    }

    buildChunkWorld(game, noise, noise2, noise3) {
        for (let x = 0; x < 16; x++) {

            for (let z = 0; z < 16; z++) {
                for (let y = 0; y < 64; y++) {
                    //if (y == 0) this.setBlockAt(x, y, z, game.blocks.dirt);
                   // if (y == 1 && z == 3) this.setBlockAt(x, y, z, game.blocks.dirt);
                   // if (y == 2 && z == 3) this.setBlockAt(x, y, z, game.blocks.dirt);
                   if (y < 20){
                        this.setBlockAt(x, y, z, game.blocks.dirt);
                        continue;
                    }
                        
                    var n = noise.noise((this.worldPos.x + x) * 0.0001, (this.worldPos.z + z) * 0.0001);
                    var n2 = noise2.noise((this.worldPos.x + x) * 0.0001, (this.worldPos.z + z) * 0.0001);
                    var n3 = noise3.noise((this.worldPos.x + x) * 0.01, (this.worldPos.z + z) * 0.01)+20;
                    var n4 = noise3.noise3d((this.worldPos.x + x) * 0.01, y*0.01, (this.worldPos.z + z) * 0.01)*20;
                    //var n4 = noise.noise3d((this.worldPos.x + x) * 0.003, y * 0.03, (this.worldPos.z + z) * 0.003);
                    //var n5 = noise2.noise3d((this.worldPos.x + x) * 0.01, y * 0.01, (this.worldPos.z + z) * 0.01);
                    var nf = (n + n2 +n3 + n4);
                    //nf += 9;
                    //if (n4 * 32 > y) nf -= n4/2;
                    if (nf > y) {
                        this.setBlockAt(x, y, z, game.blocks.dirt);
                    }

                    n = noise2.noise((this.worldPos.x + x) * 0.005, (this.worldPos.z + z) * 0.005);
                    n2 = noise.noise((this.worldPos.x + x) * 0.005, (this.worldPos.z + z) * 0.005);
                    var n4 = noise.noise3d((this.worldPos.x + x) * 0.05, y * 0.04, (this.worldPos.z + z) * 0.05);
                    var n5 = noise2.noise3d((this.worldPos.x + x) * 0.01, y * 0.004, (this.worldPos.z + z) * 0.01);
                    if ((n+n2) * 64 > y) {
                        this.setBlockAt(x, y, z, game.blocks.limestone);
                        if (n5 > 0.2 || n4 > 0.2)this.setBlockAt(x, y, z, null);
                    }
                    
                }
            }
        }

        for (let x = 0; x < 16; x++) {

            for (let z = 0; z < 16; z++) {
                for (let y = 0; y < 64; y++) {
                    if (this.getBlockAt(x, y, z) == "d" && this.getBlockAt(x, y + 1, z) == null) {
                        this.setBlockAt(x, y, z, game.blocks.grass);
                    }
                }
            }
        }
    }

    tick(game, deltaTime){

    }

    render(game){
        this.mesh.render(game.gl,game.shaderProgram,game.camera.perspectiveMatrix,game.glTexture,0);
    }

    update(game){
        this.fillSunlight();
        this.recalculateMesh(game);
    }
    setBlockAt(x,y,z, block){
        if (x < 0 || x > 15 || z < 0 || z > 15 || y < 0 || y > 64) return;
        if (block == null) this.blocks[(x * 16 + z) + (y * 64 * 16)] = null;
        else this.blocks[(x * 16 + z) + (y * 64 * 16)] = block.id;
    }

    getBlockAt(x,y,z){
        if (x < 0 || x > 15 || z < 0 || z > 15 || y < 0 || y > 64) return undefined;
        return this.blocks[(x * 16 + z) + (y * 64 * 16)];
    }

    setLightAt(x,y,z, light){
        if (x < 0 || x > 15 || z < 0 || z > 15 || y < 0 || y > 64) throw "blah";
        this.lightMap[(x * 16 + z) + (y * 64 * 16)] = light;
    }

    getLightAt(x,y,z){
        if (x < 0 || x > 15 || z < 0 || z > 15 || y < 0 || y > 64) return 1;
        return this.lightMap[(x * 16 + z) + (y * 64 * 16)]; 
    }
}

export default Chunk;