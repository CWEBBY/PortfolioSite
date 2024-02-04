/* ~/Core/Context.js, Cwebb.
 */

// Imports / Exports
import { GLFloat } from "./GL/Enums.js";
import { glBind } from "./GL/API.js";
import { VertexArray } from "./VertexArray.js";
export { Context };

const FULL_SCREEN_VERTS = {
    indicies: [0, 1, 2, 2, 3, 0],
    attributes: [
        /* #1 */    /* Pos */ -1, -1,  /* UV */ 0, 0,
        /* #2 */    /* Pos */ -1, 1,   /* UV */ 0, 1,
        /* #3 */    /* Pos */ 1, 1,    /* UV */ 1, 1,
        /* #4 */    /* Pos */ 1, -1,   /* UV */ 1, 0
    ]
};

// Context
class Context {
    constructor(canvas, params = {}) {
        this.renderers = [];
        this.scale = params.scale || 1;
        this.canvas = canvas;

        { glBind(this.canvas, params); }

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.blitQuad = new VertexArray({ a_Position: GLFloat(2), a_Texcoords: GLFloat(2) });
        this.blitQuad.attributes.set(FULL_SCREEN_VERTS.attributes);
        this.blitQuad.indicies.set(FULL_SCREEN_VERTS.indicies);
    }

    // Vars
    scale;
    canvas;
    context;
    renderers;

    // Functions
    resize() {
        this.canvas.width = Math.min(this.canvas.offsetWidth, this.canvas.offsetWidth * devicePixelRatio) * this.scale;
        this.canvas.height = Math.min(this.canvas.offsetHeight, this.canvas.offsetHeight * devicePixelRatio) * this.scale;
    }

    blit(source, destination, shader) {
        FULL_SCREEN_VERTS.vertices.bind();

        shader.bind();


        glDraw(FULL_SCREEN_VERTS.indicies.count);
    }
}