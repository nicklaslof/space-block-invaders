import Texture from "../gl/texture.js";
import Block from "./block.js";

class Wood extends Block{
    constructor(game) {
        super(game, "w",49,17,49,17,14,14);
        this.topColor = this.sideColor = [1.0,1.0,1.0,1.0];
    }
}
export default Wood;