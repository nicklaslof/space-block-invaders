import Texture from "../gl/texture.js";
import Block from "./block.js";

class Leaves extends Block{
    constructor(game) {
        super(game, "b",49,0,49,0,14,14);
        //this.topColor = this.sideColor = [0.7,0.7,0.7,1.0];
        this.blockColor1 = [0.9,0.89,0.14,1.0];
        this.blockColor2 = [0.9,0.87,0.14,1.0];
        this.blockColor3 = [0.9,0.85,0.14,1.0];
        this.blockColor4 = [0.9,0.83,0.14,1.0];
        this.blockColor5 = [0.9,0.80,0.14,1.0];
    }

    getSideColor(x,y,z){
       
        var sinX = Math.sin(x);
        var sinZ = Math.sin(z);

        var v = Math.abs(sinX - sinZ);


        if (v < 0.2) return this.blockColor1;
        else if (v < 0.4) return this.blockColor2;
        else if (v < 0.6) return this.blockColor3;
        else if (v < 0.8) return this.blockColor4;
        else return this.blockColor5;
    }
}
export default Leaves;