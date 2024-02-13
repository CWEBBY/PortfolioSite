/* ~/Core/Camera.js, Cwebb.
 */

// Imports / Exports
import { GLCommandBuffer } from "./GLCommandBuffer.js";
import { glViewport } from "./GL/API.js";
import { Mat4x4 } from "./Mat4x4.js";
export { Camera, OrthographicCamera, PerspectiveCamera };

// Camera
class Camera {
    constructor(context, params = {}) {
        this.context = context;

        this.farClip = params["farClip"] || 1;
        this.nearClip = params["nearClip"] || 0;

        this.glCommandBuffer = new GLCommandBuffer();
    }

    // Vars
    context;
    commandBuffer;

    translation;
    rotation; // maybe consolidate all transforms into a parent class?

    farClip;
    nearClip;

    // Properties
    get aspectRatio() { return this.context.canvas.width / this.context.canvas.height; }

    // Functions
    render(scene) {
        let translationMat = new Mat4x4();
        let rotationMat = new Mat4x4();
        let scaleMat = new Mat4x4();

        let RSMat = new Mat4x4();
        let TRSMat = new Mat4x4();

        this.glCommandBuffer.clearRenderTarget(0, 0, 0, 1);
        // Upload light uniforms here...

        glViewport(0, 0, // IDK what to do about this? 
            this.context.canvas.width, // break the viewport up?
            this.context.canvas.height // Find the aspect of that later? 
        ); // ...then maybe apply THAT aspect to the VP mat?

        for (let entity of scene.entities) {
            translationMat = Mat4x4.Translation(entity.translation);
            rotationMat = Mat4x4.Rotation(entity.rotation);
            scaleMat = Mat4x4.Scale(entity.scale);

            Mat4x4.multiply(RSMat, rotationMat, scaleMat);
            Mat4x4.multiply(TRSMat, translationMat, RSMat);

            this.glCommandBuffer.setStaticMatrix4x4("M", TRSMat.array);
            this.glCommandBuffer.drawMesh(entity.mesh, entity.shader);
        }

        this.context.executeGLCommandBuffer(this.glCommandBuffer);
        this.glCommandBuffer.clearCommands();
    }
}

class PerspectiveCamera extends Camera {
    constructor(context, params = {}) {
        super(context, params);

        this.fov = params["fov"] || 60;
    }

    // Vars 
    fov;

    // Functions
    render(scene) {
        this.glCommandBuffer.setStaticMatrix4x4("VP",
            Mat4x4.perspective(
                this.aspectRatio, this.fov,
                this.nearClip, this.farClip
            ).array
        );

        super.render(scene);
    }
}

class OrthographicCamera extends Camera {
    constructor(context, params = {}) {
        super(context, params);

        this.size = params["size"] || 1;
    }

    // Vars
    size;

    // Functions
    render(scene) {
        let halfHeight = this.size / 2;
        let halfWidth = (this.size * this.aspectRatio) / 2;

        this.glCommandBuffer.setStaticMatrix4x4("VP",
            Mat4x4.ortho(
                -halfWidth, halfWidth,
                -halfHeight, halfHeight,
                this.nearClip, this.farClip
            ).array
        );

        super.render(scene);
    }
}

