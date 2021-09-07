import Texture from "../gl/texture.js";

class Block{
    constructor(game,id,texSideX,texSideY,texTopX,texTopY,texW,texH) {
        this.id = id;
        this.topColor = [1.0,1.0,1.0,1.0];
        this.sideColor = [1.0,1.0,1.0,1.0];
        this.sideTexture = new Texture(game.glTexture.tex,texSideX,texSideY,texW,texH);
        this.topTexture = new Texture(game.glTexture.tex,texTopX,texTopY,texW,texH);
    }
}
export default Block;