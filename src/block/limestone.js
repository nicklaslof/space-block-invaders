import Texture from "../gl/texture.js";
import Block from "./block.js";

class Limestone extends Block{
    constructor(game) {
        super(game, "l",49,0,49,0,14,14);
        this.topColor = this.sideColor = [1.0,1.0,1.0,1.0];
    }
}
export default Limestone;