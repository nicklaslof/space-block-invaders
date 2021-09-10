import Mesh from "../gl/mesh.js";
const baseSize = 0.5;
const white = [1,1,1,1];
//Create a square mesh by batching the various sides of it.
class MeshBuilder{

    //Create a new batch
    static start(gl,x,y,z){
        return {mesh:new Mesh(gl,x,y,z),verticies:[],colors:[],uvs:[],lights:[]};
    }

    //Set the colors of current added side
    static addColor(colors,color){
        if (color == null) color = white;
            colors.push(color,color,color,color);
    }
    //Set the lights of current added side
    static addLight(lights,light){
        let l = [light,light,light,1];
        lights.push(l,l,l,l);
    }

    static addLightArray(lights,lightArray){
        //let l = [light,light,light,1];
        for (let i = 0; i < 4; i++) {
            lights.push([lightArray[i],lightArray[i],lightArray[i],1]);          
        }
        //lights.push(lightArray[0],lightArray[1],lightArray[2],lightArray[3]);
    }

    //Finish the batch and build the mesh
    static build(meshBuild){
        meshBuild.mesh.addVerticies(meshBuild.verticies, meshBuild.colors, meshBuild.uvs,meshBuild.lights);
        meshBuild.mesh.updateMesh();
        return meshBuild.mesh;
    }

    //Add left side of the mesh. Heigth and offset can be specified(Used for walls being two units high and lava being offseted slightly down)
    static left(uvs,render,x,y,z,light,height,color,lightArray){
        if (height == null) height = 1;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(render.colors,color);
            if (lightArray != null) MeshBuilder.addLightArray(render.lights,lightArray);
            else MeshBuilder.addLight(render.lights,light);
            uvs.forEach(uv => { render.uvs.push(uv); });
            render.verticies.push(
                x-baseSize,y+h-baseSize,z-baseSize,
                x-baseSize,y+h-baseSize,z+baseSize,
                x-baseSize,y+h+baseSize,z+baseSize,
                x-baseSize,y+h+baseSize,z-baseSize
            );
        }

    }
    //Add right side of the mesh. Heigth and offset can be specified(Used for walls being two units high and lava being offseted slightly down)
    static right(uvs,render,x,y,z,light,height,color,lightArray){
        if (height == null) height = 1;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(render.colors,color);
            if (lightArray != null) MeshBuilder.addLightArray(render.lights,lightArray);
            else MeshBuilder.addLight(render.lights,light);
            uvs.forEach(uv => { render.uvs.push(uv); });
            render.verticies.push(
                x+baseSize,y+h-baseSize,z+baseSize,
                x+baseSize,y+h-baseSize,z-baseSize,
                x+baseSize,y+h+baseSize,z-baseSize,
                x+baseSize,y+h+baseSize,z+baseSize
            );
        }
    }
    //Add front side of the mesh. Heigth and offset can be specified(Used for walls being two units high and lava being offseted slightly down)
    static front(uvs,render,x,y,z,light,height,color,lightArray){
        if (height == null) height = 1;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(render.colors,color);
            if (lightArray != null) MeshBuilder.addLightArray(render.lights,lightArray);
            else MeshBuilder.addLight(render.lights,light);
            uvs.forEach(uv => { render.uvs.push(uv); });
            render.verticies.push(
                x-baseSize,y+h-baseSize,z+baseSize,
                x+baseSize,y+h-baseSize,z+baseSize,
                x+baseSize,y+h+baseSize,z+baseSize,
                x-baseSize,y+h+baseSize,z+baseSize
            );
        }
    }
    //Add back side of the mesh. Heigth and offset can be specified(Used for walls being two units high and lava being offseted slightly down)
    static back(uvs,render,x,y,z,light,height,color, lightArray){
        if (height == null) height = 1;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(render.colors,color);
            if (lightArray != null) MeshBuilder.addLightArray(render.lights,lightArray);
             else MeshBuilder.addLight(render.lights,light);
            uvs.forEach(uv => { render.uvs.push(uv); });
            render.verticies.push(
                x+baseSize,y+h-baseSize,z-baseSize,
                x-baseSize,y+h-baseSize,z-baseSize,
                x-baseSize,y+h+baseSize,z-baseSize,
                x+baseSize,y+h+baseSize,z-baseSize

            );
        }
    }

    //Add left side of the mesh. Offset can be specified(Used for walls being two units high and lava being offseted slightly down)
    static top(uvs,render,x,y,z,light, color, lightArray){
        //console.log(lightArray);
        MeshBuilder.addColor(render.colors,color);
        if (lightArray != null) MeshBuilder.addLightArray(render.lights,lightArray);
        else MeshBuilder.addLight(render.lights,light);
        
        uvs.forEach(uv => { render.uvs.push(uv); });
        render.verticies.push(
            x-baseSize,y+baseSize,z-baseSize,
            x-baseSize,y+baseSize,z+baseSize,
            x+baseSize,y+baseSize,z+baseSize,
            x+baseSize,y+baseSize,z-baseSize
        );
    }
    static bottom(uvs,render,x,y,z,light, color, lightArray){

        MeshBuilder.addColor(render.colors,color);
        if (lightArray != null) MeshBuilder.addLightArray(render.lights,lightArray);
        else MeshBuilder.addLight(render.lights,light);
        uvs.forEach(uv => { render.uvs.push(uv); });
        render.verticies.push(
            x-baseSize,y-baseSize,z-baseSize,
            x+baseSize,y-baseSize,z-baseSize,
            x+baseSize,y-baseSize,z+baseSize,
            x-baseSize,y-baseSize,z+baseSize
        );
    }

}
export default MeshBuilder;