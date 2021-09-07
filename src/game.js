import Blocks from "./block/blocks.js";
import ShaderProgram from "./gl/shaderprogram.js";
import World from "./world/world.js";
import Texture from "./gl/texture.js";
import GlTexture from "./gl/gltexture.js";
import Camera from "./gl/camera.js";
import MeshBuilder from "./gl/meshbuilder.js";
import Input from "./input/input.js";
const up = {x:0,y:1,z:0};
const down = {x:0,y:-1,z:0}
class Game{

    constructor() {
        this.last = performance.now();
        this.counter = 0;
        this.fps = 0;
        this.keys = [];
        this.speed = 10;
        
        onkeydown=onkeyup=e=> this.keys[e.keyCode] = e.type;
        this.input = new Input();

        this.gameCanvas = document.getElementById("c");
        this.gameCanvas.width = "1280";
        this.gameCanvas.height = "768";

        this.gameCanvas.addEventListener('click', (e) => { this.gameCanvas.requestPointerLock();});

        this.gl = this.gameCanvas.getContext("webgl",{antialias: true});
        //this.shaderProgram = new ShaderProgram(this.gl,`precision lowp float;attribute vec4 p;attribute vec4 c;attribute vec4 l;attribute vec2 u;uniform mat4 mvm;uniform mat4 pm;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;void main(){gl_Position=pm*mvm*p;vc=c;li=l;uv=u;d=gl_Position.z/27.0;}`,`precision lowp float;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;uniform sampler2D s;uniform float h;void main(){vec4 col=texture2D(s,uv)*vc;gl_FragColor=col;}`);
        this.shaderProgram = new ShaderProgram(this.gl,`precision lowp float;attribute vec4 p;attribute vec4 c;attribute vec4 l;attribute vec2 u;uniform mat4 mvm;uniform mat4 pm;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;void main(){gl_Position=pm*mvm*p;vc=c;li=l;uv=u;d=gl_Position.z/27.0;}`,`precision lowp float;varying vec4 vc;varying vec2 uv;varying float d;varying vec4 li;uniform sampler2D s;uniform float h;void main(){vec4 col=texture2D(s,uv)*vc;float z=gl_FragCoord.z/gl_FragCoord.w;float fogFactor=exp2(-0.01*0.01*z*z*1.442695);fogFactor=clamp(fogFactor,0.0,1.0);vec4 c=vec4(col.rgb,col.a)*li;if(c.a<0.2)discard;if(h>0.0)gl_FragColor=vec4(1,0,0,1);else gl_FragColor=mix(vec4(0.1,0.5,0.9,1),c,fogFactor);}`);
        this.glTexture = new GlTexture(this.gl,"./assets/t.png");
        this.camera = new Camera(this.gl,0,0,0);
        this.cameraPosition = {x:0,y:16,z:20};
        this.velocity = {x:0,z:0};
        this.strafe = {x:0,z:0};
        this.tempVector = {x:0,z:0};

        this.meshBuilder = new MeshBuilder();
        
        this.blocks = new Blocks(this);
        this.world = new World(this, 4,4);
    }

    mainLoop(){
        var now = performance.now();
        var deltaTime = (now - this.last)/1000;
        this.last = now;

        this.counter += deltaTime;
        this.fps++;
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.clearColor(0.1,0.5,0.9,1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.disable(this.gl.BLEND);

        this.input.tick(this,deltaTime);

        this.updateCamera(deltaTime);

        this.world.tick(this,deltaTime);
        this.world.render(this);

        if (this.counter > 1){
            console.log(now/1000+ " FPS: "+this.fps);
            this.counter = this.fps = 0;
        }

    }

    updateCamera(deltaTime){
        this.velocity.x = 0;
        this.velocity.z = 0;
        this.strafe.x = 0;
        this.strafe.z = 0;

        this.camera.rotate((this.input.getMouseX()/9) * deltaTime);
        this.camera.rotateX((this.input.getMouseY()/9) * deltaTime);
        let cameraDirection = this.camera.getDirection();

        this.velocity.z = this.input.axes.y;

        if (this.input.axes.x < 0) this.cross(this.strafe,cameraDirection,up);
        if (this.input.axes.x > 0) this.cross(this.strafe,cameraDirection,down);

        if (this.velocity.x !=0 || this.velocity.z != 0 || this.strafe.x != 0 || this.strafe.z !=0){
            //combine forward/backward movement with strafe movement and multiply that with the direction the camera is facing
            this.tempVector.x = cameraDirection.x * this.velocity.z + this.strafe.x;
            this.tempVector.z = cameraDirection.z * this.velocity.z + this.strafe.z;

            //normalize it to prevent moving faster when strafing and moving forward/backward at the same time
            this.normalize(this.tempVector);

            //multiply the final normalized movement with the speed the player will move multiplied with the deltatime
            this.tempVector.x *= deltaTime*this.speed;
            this.tempVector.z *= deltaTime*this.speed;

            //finally add the current position of the player to the calculated movement vector
            this.tempVector.x += this.cameraPosition.x;
            this.tempVector.z += this.cameraPosition.z;

            //check if the player can move in X or Z direction separetly to allow sliding on the walls. Otherwise the player would get stuck when close to a wall
            //which would be very annoying. If the player can move to the new position then transform the current position to that position.
            this.cameraPosition.x += this.tempVector.x-this.cameraPosition.x;
            this.cameraPosition.z += this.tempVector.z-this.cameraPosition.z;
        }

        this.camera.setPos(this.cameraPosition);


    }

    getRandomFloat(min, max){
        return Math.random() * (max - min) + min
    }

    getRandomInt(min, max){
        return Math.floor(this.getRandomFloat(min,max));
    }

    //Vector cross product math of two vectors
    cross(out, a, b) {
        out.x = a.y * b.z - a.z * b.y;
        out.y = a.z * b.x - a.x * b.z;
        out.z = a.x * b.y - a.y * b.x;
        return out;
    }

    normalize(v) {
        let len = v.x * v.x + v.z * v.z;
        if (len > 0) {
          len = 1 / Math.sqrt(len);
        }
        v.x *= len;
        v.z *= len;
    }

}

export default Game;