import * as matrix4 from "./matrix4.js";
import * as quaternion from "./quaternion.js";

class Camera{
    constructor(gl, x,y,z){
        this.gl = gl;
        //The perspectivematrix that is used in the WebGL shader to calculate where in the world an object should be rendered in relation to the camera position
        this.perspectiveMatrix = matrix4.create();
        this.position = {x,y,z};
        this.currentRot = 0;
        this.currentRotX = 0;
        this.updatePerspective();
        this.updateRotationTranslation();
        this.quaternion = quaternion.create();
    }

    //Increase the rotatation of the camera. Rotation is stored as radians
    rotate(rot){
        quaternion.rotateY(this.quaternion, this.quaternion, rot);
        this.currentRot += rot;
        this.updateRotation();

    }

    //Increase the rotatation of the camera. Rotation is stored as radians
    rotateX(rot){
        if (this.currentRotX + rot < -1.6) return;
        if (this.currentRotX + rot > 1.6) return;
        quaternion.rotateX(this.quaternion, this.quaternion, rot);
        this.currentRotX += rot;
        this.updateRotation();
    }

    // Set the rotation of the camera
    setRotation(rot){
        this.currentRot = rot * Math.PI / 180;
        this.updateRotation();
    }

    //Update the rotation of the camera quaterantion.
    updateRotation(){
        this.currentRot = this.currentRot%(Math.PI*2);
        this.currentRotX = this.currentRotX%(Math.PI*2);
        //if (this.currentRot < 0) this.currentRot = Math.PI*2;
        quaternion.fromEuler(this.quaternion, this.getRotationXDeg(), this.getRotationDeg(), 0);
    }

    //Get the rotation in degrees instead of radians
    getRotationDeg(){
        return this.currentRot* (180/Math.PI);
    }
    getRotationXDeg(){
        return this.currentRotX* (180/Math.PI);
    }

    getQuaternion(){
        return this.quaternion;
    }

    //Set the position of the camera and recalculate rotation and position
    setPos(position){
        this.position.x = position.x;
        this.position.y = position.y+1.2;
        this.position.z = position.z;
        this.updatePerspective();
        this.updateRotationTranslation();
    }

    //This shouldn't be needed but I couldn't get the rotation to work correctly if not reseting the perspectivematrix everytime
    //Just setting the position to zero should be enough but apparently not.
    updatePerspective(){
        return matrix4.perspective(this.perspectiveMatrix,70 * Math.PI / 180,this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,0.1,10000);
    }

    //Return the camera direction as a vector using Sin and Cos to calculate the vector based on the camera rotation in radians.
    getDirection(){
        return {x:Math.sin(this.currentRot)*Math.cos(this.currentRotX),y:-Math.sin(this.currentRotX),z:Math.cos(this.currentRot)*Math.cos(this.currentRotX)};
    }

    //Update the perspectivematrix with the current rotation and position. Super important to rotate first and then move
    //otherwise the pivot point (center of rotation) will be the current position of the camera and not 0,0,0
    updateRotationTranslation(){
        matrix4.rotateX(this.perspectiveMatrix,this.perspectiveMatrix,-this.currentRotX);
        matrix4.rotateY(this.perspectiveMatrix,this.perspectiveMatrix,-this.currentRot);
        matrix4.translate(this.perspectiveMatrix, this.perspectiveMatrix, [-this.position.x, -this.position.y, -this.position.z]);
    }
}
export default Camera;