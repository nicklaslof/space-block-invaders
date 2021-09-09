import Texture from "../gl/texture.js";
import Block from "./block.js";

class Wood extends Block{
    constructor(game) {
        super(game, "w",48,16,48,16,16,16);
        this.topColor = this.sideColor = [1.0,1.0,1.0,1.0];
    }
}
export default Wood;