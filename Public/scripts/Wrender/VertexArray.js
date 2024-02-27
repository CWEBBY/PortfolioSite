/* ~/Core/VertexArray.js, Cwebb.
 */


// Imports / Exports
import { AttributeBuffer } from "./Buffers.js";
export { VertexArray };

// VertexArray
class VertexArray {
    constructor(layout, usage = "STATIC_DRAW") {
        this.attributes = new AttributeBuffer(layout, usage);
    }

    // Vars
    attributes;

    // Properties 
    get count() {
        return this.attributes.count / this.attributes.stride;
    }

    // Functions
    release() {
        this.attributes.release();
    }

    bind() {
        this.attributes.bind();
    }

    unbind() {
        this.attributes.unbind();
    }
}