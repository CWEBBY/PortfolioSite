/* ~/Core/Camera.js, Cwebb.
 */

// Imports / Exports
import { Clock } from "./Clock.js";
import { Shader } from "./Shader.js";
import { glViewport } from "./GL/API.js";
import { FrameBuffer } from "./Framebuffer.js";

export { Camera };

// Camera
class Camera {
    constructor(context, params = {}) {
        this.passes = [];
        this.backBuffer = null;
        
        this.size = {
            width: context.canvas.width,
            height: context.canvas.height
        }
        
        this.buffers = [
            new FrameBuffer(context.canvas.width, context.canvas.height),
            new FrameBuffer(context.canvas.width, context.canvas.height)
        ];
        
        this.viewport = {
            x: params?.viewport?.x || 0,
            y: params?.viewport?.y || 0,
            width: params?.viewport?.width || 1,
            height: params?.viewport?.height || 1
        };

        context.addRenderer(this);
    }

    // Vars
    size;
    viewport;
    
    buffers;
    backBuffer;

    prepasses;
    postpasses;
    
    // Functions
    addRenderPass(renderPass) {
        this.passes.push(renderPass)
        return this.passes.length - 1;
    }

    addBuffer(framebuffer) {
        this.buffers.push(framebuffer)
        return this.buffers.length - 1;
    }

    resize(width, height) {
        this.size = { width, height };

        for (let i = 0; i < this.buffers.length; i++) 
            this.buffers[i].resize(this.viewport.width * width, this.viewport.height * height);
    }

    render(scene = null) {
        Shader.SetGlobalFloat("uTIME", Clock.current);
        Shader.SetGlobalFloat2("uRESOLUTION", [this.size.width, this.size.height]);

        // All the prepasses.


        // Then render the scene.


        // All the postpasses.

        for (let pass = 0; pass < this.passes.length; pass++) {
            let isLastPass = pass >= this.passes.length - 1;
            if (isLastPass) {
                glViewport(
                    this.viewport.x * this.size.width,
                    this.viewport.y * this.size.height,
                    this.viewport.width * this.size.width,
                    this.viewport.height * this.size.height
                );
                this.passes[pass].render();
            }
            else {
                let passFB = this.buffers[this.backBuffer == this.buffers[0] ? 1 : 0];
                passFB.bind();
                { this.passes[pass].render(); }
                passFB.unbind();
                this.backBuffer = passFB;
            }
        }
        this.backBuffer = null;
    }
}