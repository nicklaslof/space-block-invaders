import Texture from "../gl/texture.js";

// Base class for a block
class Block{
    constructor(game,id,texSideX,texSideY,texTopX,texTopY,texW,texH) {
        this.id = id;
        this.topColor = [1.0,1.0,1.0,1.0];
        this.sideColor = [1.0,1.0,1.0,1.0];
        this.sideTexture = new Texture(game.glTexture.tex,texSideX,texSideY,texW,texH);
        this.topTexture = new Texture(game.glTexture.tex,texTopX,texTopY,texW,texH);
        this.blockAABB = {minX:0,minY:0,minZ:0,maxX:0,maxY:0,maxZ:0};
        // It can have different textures on sides and top
    }

    // Is called when checking if something is colliding with this block. Return true or false. Classic AABB testing.
    intersects(blockPos,checkAABB){
        this.blockAABB.minX=blockPos.x-0.5;
        this.blockAABB.minY=blockPos.y;
        this.blockAABB.minZ=blockPos.z-0.5;
        this.blockAABB.maxX=blockPos.x+0.5;
        this.blockAABB.maxY=blockPos.y+1;
        this.blockAABB.maxZ=blockPos.z+0.5;
       
        return (checkAABB.minX <= this.blockAABB.maxX && checkAABB.maxX >= this.blockAABB.minX) &&
         (checkAABB.minY <= this.blockAABB.maxY && checkAABB.maxY >= this.blockAABB.minY) &&
         (checkAABB.minZ <= this.blockAABB.maxZ && checkAABB.maxZ >= this.blockAABB.minZ);
    }

    getTopColor(x,y,z){
        return this.topColor;
    }

    getSideColor(x,y,z){
        return this.sideColor;
    }
}
export default Block;