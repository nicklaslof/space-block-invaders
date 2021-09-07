import Texture from "../gl/texture.js";
import Block from "./block.js";

class Limestone extends Block{
    constructor(game) {
        super(game, "l",48,0,48,0,16,16);
        this.topColor = this.sideColor = [1.0,1.0,1.0,1.0];
    }
}
export default Limestone;