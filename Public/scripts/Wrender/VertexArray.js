/* ~/Core/VertexArray.js, Cwebb.
 */


// Imports / Exports
import { AttributeBuffer, IndexBuffer } from "./Buffers.js";
export { VertexArray };

// VertexArray
class VertexArray {
    constructor(layout, usage = "STATIC_DRAW") {
        this.indicies = new IndexBuffer(usage);
        this.attributes = new AttributeBuffer(layout, usage);
    }

    // Vars
    attributes;
    indicies;

    // Functions
    release() {
        this.indicies.release();
        this.attributes.release();
    }

    bind() {
        this.indicies.bind();
        this.attributes.bind();
    }

    unbind() {
        this.indicies.unbind();
        this.attributes.unbind();
    }
}