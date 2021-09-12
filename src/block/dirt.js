import Texture from "../gl/texture.js";
import Block from "./block.js";

class Dirt extends Block{
    constructor(game) {
        super(game, "d",17,17,17,17,14,14);
        this.topColor = this.sideColor = [1.0,1.0,1.0,1.0];
    }
}
export default Dirt;