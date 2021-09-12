//WebGL reprentation of an image
class GlTexture {
    constructor(gl, file) {
        this.tex = gl.createTexture();
        this.image = new Image();
        this.dirty = true;;
        this.image.onload  = () =>{
            var anisotropyExtension = gl.getExtension("EXT_texture_filter_anisotropic");
            gl.bindTexture(gl.TEXTURE_2D, this.tex);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            if (anisotropyExtension) gl.texParameteri(gl.TEXTURE_2D, anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT, 8);
            this.dirty = false;

        };

        this.image.src = file;
    }
}

export default GlTexture;