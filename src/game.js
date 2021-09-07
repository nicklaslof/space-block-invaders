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
        
        this.keys = [];
        this.speed = 8;
        
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
        this.cameraPosition = {x:0,y:64,z:0};
        this.velocity = {x:0,z:0};
        this.strafe = {x:0,z:0};
        this.tempVector = {x:0,z:0};

        this.meshBuilder = new MeshBuilder();
        
        this.blocks = new Blocks(this);
        this.world = new World(this, 24,24);
        this.jump = false;
        this.jumpCounter = 0;
        this.last = performance.now();
        this.counter = 0;
        this.fps = 0;
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

        if (this.jump){
            this.jumpAngle += deltaTime*8;
            var j = Math.sin(this.jumpAngle);
            this.cameraPosition.y += j/7;
            if (this.jumpAngle >= (Math.PI*2)-1.5) this.jump = false;
        }

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
            if (this.canMove(this.tempVector.x,this.cameraPosition.y, this.cameraPosition.z)) this.cameraPosition.x += this.tempVector.x-this.cameraPosition.x;
            if (this.canMove(this.cameraPosition.x,this.cameraPosition.y,this.tempVector.z)) this.cameraPosition.z += this.tempVector.z-this.cameraPosition.z;
        }
        this.tempVector.y = this.cameraPosition.y - (deltaTime*15);
        if (!this.onGround(this.tempVector.y) && !this.jump){
            this.cameraPosition.y += this.tempVector.y-this.cameraPosition.y;
        } else{
            if(this.input.firePressed && !this.jump){
                this.jumpAngle = 0;
                this.jump = true;
            }
        }

        this.camera.setPos(this.cameraPosition);
    }

    onGround(y){
        //var radius = 1.8;
        //let y = Math.round(this.cameraPosition.y - radius);
        //let y = this.cameraPosition.y - radius;
        //if (this.checkIntersects(this.cameraPosition.x,this.cameraPosition.y-0.5,this.cameraPosition.z)) return true;
        if (this.canMove(this.cameraPosition.x,y,this.cameraPosition.z)) return false;
        return true;
    }

    canMove(x,y,z){
        y = y + 0.5;
        var radius = 0.4;
        let x1 = Math.round(x + radius);
        let z1 = Math.round(z + radius);
        let x2 = Math.round(x - radius);
        let z2 = Math.round(z - radius);


        if (this.checkIntersects(x1,y,z1)) return false;
        if (this.checkIntersects(x2,y,z1)) return false;
        if (this.checkIntersects(x1,y,z2)) return false;
        if (this.checkIntersects(x2,y,z2)) return false;


        return true;
    }

    checkIntersects(x,y,z){
       // console.log("y:"+y);
        var chunk = this.world.getChunk(x,z);
        if (chunk == null) return false;
        var localBlockPosX = x&15;
        var localBlockPoxZ = z&15;
        var blockId = chunk.getBlockAt(localBlockPosX,Math.round(y),localBlockPoxZ);
        var block = this.blocks.get(blockId);
        if (block == null) return false;
        var blockPos = {x:chunk.worldPos.x+localBlockPosX,y:y,z:chunk.worldPos.z+localBlockPoxZ};
        var cameraAABB = {minX:x,minY:y,minZ:z,maxX:x+1,maxY:y+1.6,maxZ:z+1};
        var intersects = block.intersects(blockPos,cameraAABB);
        if (intersects) return true;
        return false;
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