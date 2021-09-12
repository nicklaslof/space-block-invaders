import Blocks from "./block/blocks.js";
import ShaderProgram from "./gl/shaderprogram.js";
import World from "./world/world.js";
import Texture from "./gl/texture.js";
import GlTexture from "./gl/gltexture.js";
import Camera from "./gl/camera.js";
import MeshBuilder from "./gl/meshbuilder.js";
import Input from "./input/input.js";
import UI from "./ui/ui.js";

class Game{

    constructor() {
        
        this.keys = [];
        
        onkeydown=onkeyup=e=> this.keys[e.keyCode] = e.type;
        this.input = new Input();


        this.gameCanvas = document.getElementById("c");
        this.gameCanvas.width = W;
        this.gameCanvas.height = H;

        

        this.gl = this.gameCanvas.getContext("webgl",{antialias: true});
        //this.shaderProgram = new ShaderProgram(this.gl,`precision lowp float;attribute vec4 p;attribute vec4 c;attribute vec4 l;attribute vec2 u;uniform mat4 mvm;uniform mat4 pm;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;void main(){gl_Position=pm*mvm*p;vc=c;li=l;uv=u;d=gl_Position.z/27.0;}`,`precision lowp float;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;uniform sampler2D s;uniform float h;void main(){vec4 col=texture2D(s,uv)*vc;gl_FragColor=col;}`);
        this.shaderProgram = new ShaderProgram(this.gl,`precision lowp float;attribute vec4 p;attribute vec4 c;attribute vec4 l;attribute vec2 u;uniform mat4 mvm;uniform mat4 pm;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;void main(){gl_Position=pm*mvm*p;vc=c;li=l;uv=u;d=gl_Position.z/27.0;}`,`precision lowp float;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;uniform sampler2D s;uniform float h;void main(){vec4 col=texture2D(s,uv,2.0)*vc;float z=gl_FragCoord.z/gl_FragCoord.w;float fogFactor=exp2(-0.02*0.02*z*z*1.442695);fogFactor=clamp(fogFactor,0.0,1.0);vec4 c=vec4(col.rgb,col.a)*li;if (col.rgb == vec3(0.0,0.0,0.0))discard;if(h>0.0)gl_FragColor=vec4(1,0,0,1);else gl_FragColor=mix(vec4(0.1,0.5,0.9,1),c,fogFactor);}`);
        this.glTexture = new GlTexture(this.gl,"t.png");
        this.camera = new Camera(this.gl,0,0,0);

        this.ui = new UI(this.glTexture.image);

        this.meshBuilder = new MeshBuilder();
        
        this.blocks = new Blocks(this);
       
        this.introShowing = true;
        
        this.last = performance.now();
        this.counter = 0;
        this.fps = 0;
        this.tickRate = 1000/60;
        this.accumulator = 0;
    }

    mainLoop(){

        // Render various UIs for intro and game over screens
        if (this.introShowing){
            this.input.tick(this);
            this.ui.render(this);
            if (this.input.firePressed){
                this.introShowing = false;
                this.generating = true;
                this.generateMessageShown = false;
            }
            return;
        }

        if (this.generating && !this.generateMessageShown){
            this.ui.render(this);
            this.generateMessageShown = true;
            return;
        }

        if (this.generating && this.world == null){

            this.world = new World(this, 12,12);
            this.generating = false;
            return;
        }

        if (this.world.player != null && this.world.player.health <1){
            this.gameover = true;
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.gl.clearColor(0,0,0,1);
            this.ui.render(this);
            return;

        }

        // Main loop. Do fixed timestep loop.
    
        var now = performance.now();
        var deltaTime = now - this.last;
        if (deltaTime>500) deltaTime = 16; // Dont allow too big jump in time.
        this.last = now;
        this.accumulator += deltaTime;
        var ticked = false;
        this.counter += deltaTime;

        while(this.accumulator >= this.tickRate) {
            this.input.tick(this);
            this.world.tick(this);
            this.accumulator -= this.tickRate;
            this.ticks++;
            ticked = true;
        }

        // Don't render if the texture is still loading. If there was no ticks don't render anything. This will fix both ticks and rendering to 60fps
        if (ticked && !this.glTexture.dirty){
            var interpolationOffset = this.accumulator / this.tickRate;
            //console.log(interpolationOffset);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            if (this.world.player.hitCounter>1)this.gl.clearColor(1.0,0,0,1);
            else this.gl.clearColor(0.3,0.7,0.9,1);
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.depthFunc(this.gl.LESS);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.disable(this.gl.BLEND);
            this.world.render(this,interpolationOffset);
            this.ui.render(this);
            this.fps++;
            this.gl.flush();
       }


       // FPS counter
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

    playPlayerShoot(){
        zzfx(20000,...[0.5,,143,.03,.08,.05,1,.97,4.4,,,,,,,,,.83,.01,.25]); // Shoot 1221
    }

    playerInvaderHit(){
        zzfx(20000,...[1.14,,203,.02,.12,.5,4,4.77,,.1,,,,.9,,.5,,.84,.01]); // Explosion 1226
    }

    playInvaderDied(){
        zzfx(20000,...[2.43,,591,,.26,.73,2,4.95,1,,,,,.1,4.4,.4,.22,.54,.06,.14]); // Explosion 1227
    }

    playInvaderShooting(v){
        zzfx(20000,...[v,,371,,,.3,,2.57,-4.5,8.9,,,,.7,,.1,,.68,.1,.08]); // Hit 1228
    }

    playPlayerHit(){
        zzfx(20000,...[1.5,,267,,,.73,,2.4,-0.2,-0.8,,,,.7,-1.6,.2,,.56,.05,.03]); // Hit 1258
    }

    playPlayerLanded(){
        zzfx(20000,...[0.5,,120,,.03,.02,1,2.52,-2.9,-0.1,,,,.7,,.4,,.69,.08,.19]); // Hit 1294
    }

    playPlayerJumped(){
        zzfx(20000,...[0.5,,34,.03,.05,.02,,1.86,.3,4.5,,,,,,,,.9,.1]); // Jump 1310
    }

}

export default Game;