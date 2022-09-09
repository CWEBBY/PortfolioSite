/* ~/Core/Renderer.js, Cwebb.
 */

// Imports / Exports
import { glViewport } from "./GL/API.mjs";
import { FrameBuffer } from "./Framebuffer.mjs";
export { Renderer };

// Renderer
class Renderer {
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
    passes;
    buffers;
    viewport;
    backBuffer;

    // Functions
    getPass(id) { return this.passes[id]; }
    addRenderPass(renderPass) {
        this.passes.push(renderPass)
        return this.passes.length - 1;
    }

    getBuffer(id) { return this.buffers[id]; }
    addBuffer(framebuffer) {
        this.buffers.push(framebuffer)
        return this.buffers.length - 1;
    }

    resize(width, height) {
        this.size = { width, height };
        for (let i = 0; i < this.buffers.length; i++) this.buffers[i].resize(this.viewport.width * width, this.viewport.height * height);
    }

    render() {
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