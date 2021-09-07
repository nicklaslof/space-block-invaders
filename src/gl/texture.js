//A Webgl Texture which is a part of an texture atlas (x,y position of the atlas with a width and height)
class Texture{
    constructor(texture, x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.texture = texture;
        this.dirty = true;
    }

    getUVs(){
        if (this.dirty){
            let w = 1 / 128;
            let h = 1 / 128;

            let u = (this.x * w)%1;
            let v = (this.y * h)%1;
            let u2 = (this.width * w)+u;
            let v2 = (this.height * h)+v;

            this.uvs = [[u,v2,0.0],[u2,v2,0.0], [u2,v,0.0],[u,v,0.0]];
            this.dirty = false;
        }
        return this.uvs;
    }

}

export default Texture;