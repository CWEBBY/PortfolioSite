/* ~/Core/Framebuffer.js, Cwebb.
 */

// Imports / Exports
import { gl, glViewport } from "./GL/API.mjs";
import { RenderTexture } from "./Textures.mjs";
export { FrameBuffer };

// Framebuffer
class FrameBuffer {
    constructor(width, height, params = {}) {
        this.id = gl.createFramebuffer();
        this.renderTexture = new RenderTexture(width, height, params);

        this.bind();
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            this.renderTexture.id,
            0
        );
        this.unbind();
    }

    // Vars 
    id;
    renderTexture;

    name;
    static count = 0;

    // Functions
    unbind() { gl.bindFramebuffer(gl.FRAMEBUFFER, null); }

    bind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.id);
        glViewport(0, 0, this.renderTexture.width, this.renderTexture.height);
    }

    resize(width, height) {
        this.bind();    // #FIX: Do I need to bind and...
        this.renderTexture.resize(width, height);
        this.unbind();  // ...unbind while resizing?
    }

    release() {
        this.renderTexture.release();
        gl.deleteFramebuffer(this.id);
    }
}