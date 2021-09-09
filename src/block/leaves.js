import Texture from "../gl/texture.js";
import Block from "./block.js";

class Leaves extends Block{
    constructor(game) {
        super(game, "b",32,0,32,0,16,16);
        this.topColor = this.sideColor = [0.7,0.7,0.7,1.0];
    }
}
export default Leaves;