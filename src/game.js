import Blocks from "./block/blocks.js";
import ShaderProgram from "./gl/shaderprogram.js";
import World from "./world/world.js";
import Texture from "./gl/texture.js";
import GlTexture from "./gl/gltexture.js";
import Camera from "./gl/camera.js";
import MeshBuilder from "./gl/meshbuilder.js";
import Input from "./input/input.js";

class Game{

    constructor() {
        
        this.keys = [];
        
        onkeydown=onkeyup=e=> this.keys[e.keyCode] = e.type;
        this.input = new Input();

        this.gameCanvas = document.getElementById("c");
        this.gameCanvas.width = "1280";
        this.gameCanvas.height = "768";

        this.gameCanvas.addEventListener('click', (e) => { this.gameCanvas.requestPointerLock();});

        this.gl = this.gameCanvas.getContext("webgl",{antialias: true});
        //this.shaderProgram = new ShaderProgram(this.gl,`precision lowp float;attribute vec4 p;attribute vec4 c;attribute vec4 l;attribute vec2 u;uniform mat4 mvm;uniform mat4 pm;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;void main(){gl_Position=pm*mvm*p;vc=c;li=l;uv=u;d=gl_Position.z/27.0;}`,`precision lowp float;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;uniform sampler2D s;uniform float h;void main(){vec4 col=texture2D(s,uv)*vc;gl_FragColor=col;}`);
        this.shaderProgram = new ShaderProgram(this.gl,`precision lowp float;attribute vec4 p;attribute vec4 c;attribute vec4 l;attribute vec2 u;uniform mat4 mvm;uniform mat4 pm;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;void main(){gl_Position=pm*mvm*p;vc=c;li=l;uv=u;d=gl_Position.z/27.0;}`,`precision lowp float;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;uniform sampler2D s;uniform float h;void main(){vec4 col=texture2D(s,uv,2.0)*vc;float z=gl_FragCoord.z/gl_FragCoord.w;float fogFactor=exp2(-0.02*0.02*z*z*1.442695);fogFactor=clamp(fogFactor,0.0,1.0);vec4 c=vec4(col.rgb,col.a)*li;if (col.rgb == vec3(0.0,0.0,0.0))discard;gl_FragColor=mix(vec4(0.1,0.5,0.9,1),c,fogFactor);}`);
        this.glTexture = new GlTexture(this.gl,"./assets/t.png");
        this.camera = new Camera(this.gl,0,0,0);


        this.meshBuilder = new MeshBuilder();
        
        this.blocks = new Blocks(this);
        this.world = new World(this, 2,2);
       
        this.last = performance.now();
        this.counter = 0;
        this.fps = 0;
        this.tickRate = 1000/60;
        this.accumulator = 0;
    }

    mainLoop(){
        var now = performance.now();
        var deltaTime = now - this.last;
        this.last = now;
        this.accumulator += deltaTime;
        var ticked = true;
        this.counter += deltaTime;

        while(this.accumulator >= this.tickRate) {
            this.input.tick(this);
            this.world.tick(this);
            this.accumulator -= this.tickRate;
            this.ticks++;
            ticked = true;
        }

        if (ticked){
            var interpolationOffset = this.accumulator / this.tickRate;
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.gl.clearColor(0.1,0.5,0.9,1);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LESS);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.disable(this.gl.BLEND);
            this.world.render(this,interpolationOffset);
            this.fps++;
            this.gl.flush();
       }


        if (this.counter > 1000){
            console.log(now/1000+ " FPS: "+this.fps);
            this.counter = this.fps = 0;
        }

    }

    getRandomFloat(min, max){
        return Math.random() * (max - min) + min
    }

    getRandomInt(min, max){
        return Math.floor(this.getRandomFloat(min,max));
    }

    

}

export default Game;