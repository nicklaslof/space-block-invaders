import Dirt from "./dirt.js";
import Grass from "./grass.js";
import Leaves from "./leaves.js";
import Limestone from "./limestone.js";
import Wood from "./wood.js";

class Blocks{
    constructor(game) {
        this.blockMap = new Map();
        this.dirt = this.registerBlock(new Dirt(game));
        this.grass = this.registerBlock(new Grass(game));
        this.limestone = this.registerBlock(new Limestone(game));
        this.wood = this.registerBlock(new Wood(game));
        this.leaves = this.registerBlock(new Leaves(game));
    }

    registerBlock(block){
        this.blockMap.set(block.id,block);
        return block;
    }

    get(id){
        return this.blockMap.get(id);
    }
}

export default Blocks;