/* ~/Core/Context.js, Cwebb.
 */

// Imports / Exports
import { glBind } from "./GL/API.js";
export { Context };

// Context
class Context {
    constructor(id, params = {}) {
        this.renderers = [];
        this.scale = params.scale || 1;
        this.canvas = document.getElementById(id);

        { glBind(this.canvas, params); }

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    // Vars
    scale;
    canvas;
    context;
    renderers;

    // Functions
    addRenderer(renderer) { this.renderers.push(renderer); }
    render() { this.renderers.forEach(renderer => renderers.render()); }

    resize() {
        this.canvas.width = Math.min(this.canvas.offsetWidth, this.canvas.offsetWidth * devicePixelRatio) * this.scale;
        this.canvas.height = Math.min(this.canvas.offsetHeight, this.canvas.offsetHeight * devicePixelRatio) * this.scale;
        this.renderers.forEach(renderer => renderer.resize(this.canvas.width, this.canvas.height));
    }
}