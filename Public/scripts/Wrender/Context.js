/* ~/Core/Context.js, Cwebb.
 */

// Imports / Exports
import { GLFloat } from "./GL/Enums.js";
import { VertexArray } from "./VertexArray.js";
import { glBind, glViewport, glDraw } from "./GL/API.js";
export { Context };

// Context
class Context {
    constructor(canvas, params = {}) {
        this.scale = params.scale || 1;
        this.canvas = canvas;

        { glBind(this.canvas, params); }

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.blitQuad = new VertexArray({ a_Position: GLFloat(2), a_Texcoords: GLFloat(2) });
        this.blitQuad.attributes.set([
            /* #1 */    /* Pos */ -1, -1,  /* UV */ 0, 0,
            /* #2 */    /* Pos */ -1, 1,   /* UV */ 0, 1,
            /* #3 */    /* Pos */  1, 1,    /* UV */ 1, 1,

            /* #4 */    /* Pos */ 1, 1,   /* UV */ 1, 1,
            /* #5 */    /* Pos */ 1, -1,   /* UV */ 1, 0,
            /* #6 */    /* Pos */ -1, -1,   /* UV */ 0, 0,
        ]);
    }

    // Vars
    scale;
    canvas;
    context;

    // Functions
    resize() {
        this.canvas.width = Math.min(this.canvas.offsetWidth, this.canvas.offsetWidth * devicePixelRatio) * this.scale;
        this.canvas.height = Math.min(this.canvas.offsetHeight, this.canvas.offsetHeight * devicePixelRatio) * this.scale;
    }

    blit(shader) {
        shader.bind();
        this.blitQuad.bind();
        {
            glViewport(0, 0, this.canvas.width, this.canvas.height);
            glDraw(this.blitQuad.count);
        }
        this.blitQuad.unbind();
        shader.unbind();
    }

    executeGLCommandBuffer(glCommandBuffer) {
        for (var command of glCommandBuffer.commands) { command(); }
    }

}