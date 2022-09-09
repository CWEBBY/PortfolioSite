/* ~/Core/RenderPasses.js, Cwebb.
 */

// #FIX: CREATE A BETTER WAY TO GET RESOLUTION! Not context.canvas.?...

// Imports / Exports
import { Clock } from "./Clock.mjs";
import { GLFloat } from "./GL/Enums.mjs";
import { gl, glDraw } from "./GL/API.mjs";
import { VertexArray } from "./VertexArray.mjs";
export { PostPass, CameraPass };

// RenderPass
class RenderPass {
    // Functions
    render() {

    }
}

// CameraPass
class CameraPass extends RenderPass {
    constructor(camera, scene) {
        super();
        this.camera = camera;
        this.scene = scene;
    }

    // Vars
    scene;
    camera;

    // Functions
    render() {
        // #NOTE: This render pass hasn't been implemented yet. 3D rasterization is a bit out of scope. Will come back to it later.
        /*
        for (let mesh in this.scene.meshes) {
            // Somehow abstract this? It's a lot of math to do just for a single effect.
            let proj = ortho(0, gl.canvas.width, 0, gl.canvas.height, -1, 1);
            this.shader.setMatrix4x4("u_Transform", proj); // #FIX: CREATE A BETTER WAY TO GET RES!
            this.shader.setMatrix4x4("u_ProjectectionMatrix", proj); // #FIX: CREATE A BETTER WAY TO GET RES!
            this.shader.setFloat2("u_Resolution", [gl.canvas.width, gl.canvas.height]);
            // Also feels like it's got commonality with other subclasses of RenderPass.

            mesh.shader.bind();
            //mesh.shader.setMatrix4x4("u_ViewProj", camera.viewProjection); // Somehow abstract this?
            glDraw(mesh.vertices);
        }
        */
    }
}

// PostPass
class PostPass extends RenderPass {
    constructor(shader, prepass = () => { }, postpass = () => { }) {
        super();
        this.shader = shader;
        this.prepass = prepass;
        this.postpass = postpass;
        if (!PostPass.vertices) {
            PostPass.vertices = new VertexArray({ a_Position: GLFloat(2), a_Texcoords: GLFloat(2) });
            PostPass.vertices.attributes.set([-1, -1, 0, 0, -1, 1, 0, 1, 1, 1, 1, 1, 1, -1, 1, 0]);
            PostPass.vertices.indicies.set([0, 1, 2, 2, 3, 0]);
        }
    }

    // Vars
    shader;
    prepass;
    postpass;
    vertices;

    static vertices;

    // Functions
    render() {
        PostPass.vertices.bind();
        this.shader.bind();

        this.prepass();
        {
            // Inject the bare uniforms that almost everything might need...
            this.shader.setFloat2("u_Resolution", [gl.canvas.width, gl.canvas.height]);
            this.shader.setFloat("u_Time", Clock.current);
            // ... and then call draw.
            glDraw(PostPass.vertices.indicies.count); 
        }
        this.postpass();
    }
}