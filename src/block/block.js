import Texture from "../gl/texture.js";

class Block{
    constructor(game,id,texSideX,texSideY,texTopX,texTopY,texW,texH) {
        this.id = id;
        this.topColor = [1.0,1.0,1.0,1.0];
        this.sideColor = [1.0,1.0,1.0,1.0];
        this.sideTexture = new Texture(game.glTexture.tex,texSideX,texSideY,texW,texH);
        this.topTexture = new Texture(game.glTexture.tex,texTopX,texTopY,texW,texH);
    }

    intersects(blockPos,checkAABB){
        var blockAABB = {minX:blockPos.x-0.5,minY:blockPos.y-0.5,minZ:blockPos.z-0.5,maxX:blockPos.x+0.5,maxY:blockPos.y+0.5,maxZ:blockPos.z+0.5};
        return (checkAABB.minX <= blockAABB.maxX && checkAABB.maxX >= blockAABB.minX) &&
         (checkAABB.minY <= blockAABB.maxY && checkAABB.maxY >= blockAABB.minY) &&
         (checkAABB.minZ <= blockAABB.maxZ && checkAABB.maxZ >= blockAABB.minZ);
    }
}
export default Block;