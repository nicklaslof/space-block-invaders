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

    //Finish the batch and build the mesh
    static build(meshBuild){
        meshBuild.mesh.addVerticies(meshBuild.verticies, meshBuild.colors, meshBuild.uvs,meshBuild.lights);
        meshBuild.mesh.updateMesh();
        return meshBuild.mesh;
    }

    //Add left side of the mesh. Heigth and offset can be specified(Used for walls being two units high and lava being offseted slightly down)
    static left(uvs,render,x,y,z,light,height,yOffset,color){
        if (height == null) height = 1;
        if (yOffset!=null) y += yOffset;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(render.colors,color);
            MeshBuilder.addLight(render.lights,light);
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
    static right(uvs,render,x,y,z,light,height,yOffset,color){
        if (height == null) height = 1;
        if (yOffset!=null) y += yOffset;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(render.colors,color);
            MeshBuilder.addLight(render.lights,light);
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
    static front(uvs,render,x,y,z,light,height,yOffset,color){
        if (height == null) height = 1;
        if (yOffset!=null) y += yOffset;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(render.colors,color);
            MeshBuilder.addLight(render.lights,light);
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
    static back(uvs,render,x,y,z,light,height,yOffset,color){
        if (height == null) height = 1;
        if (yOffset!=null) y += yOffset;
        for(let h = 0; h < height; h++){
            MeshBuilder.addColor(render.colors,color);
            MeshBuilder.addLight(render.lights,light);
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
    static top(uvs,render,x,y,z,light,yOffset, color){
        if (yOffset!=null) y += yOffset;
        MeshBuilder.addColor(render.colors,color);
        MeshBuilder.addLight(render.lights,light);
        uvs.forEach(uv => { render.uvs.push(uv); });
        render.verticies.push(
            x-baseSize,y+baseSize,z-baseSize,
            x-baseSize,y+baseSize,z+baseSize,
            x+baseSize,y+baseSize,z+baseSize,
            x+baseSize,y+baseSize,z-baseSize
        );
    }
    static bottom(uvs,render,x,y,z,light,yOffset, color){

        if (yOffset!=null) y += yOffset;
        MeshBuilder.addColor(render.colors,color);
        MeshBuilder.addLight(render.lights,light);
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