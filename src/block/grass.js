import Texture from "../gl/texture.js";
import Block from "./block.js";

class Grass extends Block{
    constructor(game) {
        super(game, "g",32,16,32,0,16,16);
        this.topColor = [1.0,1.0,1.0,1.0];
        this.sideColor = [1.0,1.0,1.0,1.0];
    }
}
export default Grass;