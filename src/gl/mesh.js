import * as matrix4 from "./matrix4.js";
import * as quaternion from "./quaternion.js";
//The order of and index forming a triangle
const indicies = [0,1,2,0,2,3];
//The mesh class which is responsive for rendering an object on the screen. See WebGL or OpenGL-tutorials for more info how this works.
class Mesh{
    constructor(gl, x,y,z){
        this.verticies = [];
        this.modelViewMatrix = matrix4.create();
        this.position = [x,y,z];

        this.scale = [1,1,1];
        this.gl = gl;
        this.quaternion = quaternion.create();
        this.rotX = 0;
        this.rotY = 0;
        this.setPos(x,y,z);
        //Got away with a few extra bytes by assigning these WebGL statics to class variables
        this.arrayBuffer = gl.ARRAY_BUFFER;
        this.dynamicDraw = gl.DYNAMIC_DRAW;
        this.elementArrayBuffer = gl.ELEMENT_ARRAY_BUFFER;
        this.fl = gl.FLOAT;

        this.positionsBuffer = gl.createBuffer();
        this.colorsBuffer = gl.createBuffer();
        this.lightsBuffer = gl.createBuffer();
        this.uvsBuffer = gl.createBuffer();
        this.indiciesBuffer = gl.createBuffer();

    }

    //Add verticies, colors, UVs and lights to this mesh
    addVerticies(verticies, cols, uvs,lights){
        verticies.forEach(vertex => { this.verticies.push(vertex); });
        this.updateCols(cols);
        this.updateUVs(uvs);
        this.updateLights(lights);
    }

    updateMesh(){
        //Calculate verticies, colors, UVs and lights of this mesh.
        //This will create the Float32Arrays and Uint16Arrays that WebGL wants the data in.

        //Every 6th verticies needs one index (two triangles)
        let indiciesNeeded = this.verticies.length/6;

        //Assign correct sizes of the buffers. Verticies x,y,z, Colors r,g,b,a, UVs 4 corners with 2 values each. Indicies 6 values forming two triangles
        this.verticiesBuffer32 = new Float32Array(this.verticies.length*3);
        this.cArrayBuffer32 = new Float32Array(this.verticies.length*4);
        this.uvArrayBuffer32 = new Float32Array(this.verticies.length*8);
        this.indiciesBuffer16 = new Uint16Array(indiciesNeeded*6);

        let vertexCounter = 0;
        let counter = 0;

        this.verticiesBuffer32.set(this.verticies);

        //Since we are always using squares the indicies will be the same for every 6 verticies
        for (let i = 0; i < indiciesNeeded; i++){
            for (let c = 0; c < 6; c++){
                this.indiciesBuffer16[counter+c] = indicies[c] + vertexCounter;
            }
            vertexCounter += 4;
            counter += 6;
        }

        this.numberOfIndicies = counter;
        //console.log(this.numberOfIndicies);

        //Upload the arrays to the buffers on the graphic card
        this.gl.bindBuffer(this.arrayBuffer, this.positionsBuffer);
        this.gl.bufferData(this.arrayBuffer, this.verticiesBuffer32, this.dynamicDraw);

        this.uploadCols();
        this.uploadLights();
        this.uploadUVs();
        this.gl.bindBuffer(this.elementArrayBuffer, this.indiciesBuffer);
        this.gl.bufferData(this.elementArrayBuffer, this.indiciesBuffer16, this.dynamicDraw);
    }

    cleanUp(){
        this.verticies = [];
        this.cs = [];
        this.uvs = [];
        this.verticiesBuffer32 = null;
        this.cArrayBuffer32 = null;
        this.uvArrayBuffer32 = null;
        this.indiciesBuffer16 = null;
        this.lightArrayBuffer32 = null;
 

    }

    //Move this mesh to a new position.
    setPos(x, y, z){
        this.position[0] = x;
        this.position[1] = y;
        this.position[2] = z;
        this.updateMatrix();
    }
    //Scale the mesh
    setS(s){
        this.scale[0]=s;
        this.scale[1]=s;
        this.scale[2]=s;
        this.updateMatrix();
    }

    //Rotate mesh on X axis
    rotateX(r){
        quaternion.rotateX(this.quaternion, this.quaternion, r);
        this.updateMatrix();
    }

    //Rotate mesh on Y axis
    rotateY(r){
        quaternion.rotateY(this.quaternion, this.quaternion, r);
        this.updateMatrix();
    }
    //Set the rotation to be a copy of another object (Used for Billboard Sprites)
    setQuaternion(q){
        this.quaternion = q;
        this.updateMatrix();
    }

    //Set the rotation to this euler roation
    setRotationX(r){
        this.rotX = r;
        quaternion.fromEuler(this.quaternion,this.rotX,this.rotY,0);
        this.updateMatrix();
    }

    //Set the rotation to this euler roation
    setRotationY(r){
        this.rotY = r;
        quaternion.fromEuler(this.quaternion,this.rotX,this.rotY,0);
        this.updateMatrix();
    }

    updateMatrix(){
        matrix4.fromRotationTranslationScale(this.modelViewMatrix, this.quaternion, this.position,this.scale);
    }

    updateCols(c){
        this.cs = [];
        c.forEach(cc => { cc.forEach(c => {this.cs.push(c);})});
    }
    updateLights(lights){
        this.lights = [];
        lights.forEach(light => { light.forEach(l => {this.lights.push(l);})});
    }

    updateUVs(uvs){
        this.uvs = [];
        uvs.forEach(uv => { this.uvs.push(uv);});
    }

    uploadCols(){
        this.cArrayBuffer32.set(this.cs);
        this.gl.bindBuffer(this.arrayBuffer, this.colorsBuffer);
        this.gl.bufferData(this.arrayBuffer, this.cArrayBuffer32, this.dynamicDraw);
    }
    uploadLights(){
        this.lightArrayBuffer32 = new Float32Array(this.verticies.length*4);
        this.lightArrayBuffer32.set(this.lights);
        this.gl.bindBuffer(this.arrayBuffer, this.lightsBuffer);
        this.gl.bufferData(this.arrayBuffer, this.lightArrayBuffer32, this.dynamicDraw);
    }
    uploadUVs(){
        let counter = 0;
        this.uvs.forEach(uv => {
            this.uvArrayBuffer32[counter] = uv[0];
            this.uvArrayBuffer32[counter+1] = uv[1];
            counter += 2;
        });
        this.gl.bindBuffer(this.arrayBuffer, this.uvsBuffer);
        this.gl.bufferData(this.arrayBuffer, this.uvArrayBuffer32, this.dynamicDraw);

    }
    //Render the mesh with WebGL. Allows updated color and UVs if needed (Show entities being hit and animation)
    render(gl, shaderProgram, projectionMatrix, texture,playerHurt, newUvs, newColors){
        if (newUvs != null){
            this.updateUVs(newUvs);
            this.uploadUVs();
        }

        if (newColors != null){
            this.updateCols(newColors);
            this.uploadCols();
        }

        gl.bindBuffer(this.arrayBuffer, this.positionsBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.vertexPosition, 3, this.fl, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.vertexPosition);

        gl.bindBuffer(this.arrayBuffer, this.colorsBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.color, 4, this.fl, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.color);

        gl.bindBuffer(this.arrayBuffer, this.lightsBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.light, 4, this.fl, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.light);

        gl.bindBuffer(this.arrayBuffer, this.uvsBuffer);
        gl.vertexAttribPointer(shaderProgram.locations.attribLocations.uv, 2, this.fl, false, 0, 0);
        gl.enableVertexAttribArray(shaderProgram.locations.attribLocations.uv);

        gl.useProgram(shaderProgram.shaderProgram);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture.tex);
        gl.uniform1i(shaderProgram.locations.uniformLocations.uSampler, 0);
        gl.uniform1f(shaderProgram.locations.uniformLocations.playerHurt, playerHurt);
        gl.uniformMatrix4fv(shaderProgram.locations.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderProgram.locations.uniformLocations.modelViewMatrix, false, this.modelViewMatrix);

        gl.bindBuffer(this.elementArrayBuffer, this.indiciesBuffer);
        gl.drawElements(gl.TRIANGLES,  this.numberOfIndicies,gl.UNSIGNED_SHORT,0);
    }
}

export default Mesh;