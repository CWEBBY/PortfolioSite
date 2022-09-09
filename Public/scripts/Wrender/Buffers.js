/* ~/Core/Buffers.js, Cwebb.
 */

// Imports / Exports
import { gl } from "./GL/API.js";
export { AttributeBuffer, IndexBuffer }

// Buffer
class Buffer {
    constructor(type, usage = "STATIC_DRAW") {
        this.type = type;
        this.usage = usage;
        this.id = gl.createBuffer();
    }

    // Vars
    id;
    type;
    usage;
    count;

    // Functions
    set(data) {
        this.bind();
        this.count = data.length;
        gl.bufferData(gl[this.type], data, gl[this.usage]);
        this.unbind();
    }

    bind() { gl.bindBuffer(gl[this.type], this.id); }
    unbind() { gl.bindBuffer(gl[this.type], null); }
    release() { gl.deleteBuffer(this.id); }
}

// AttributeBuffer
class AttributeBuffer extends Buffer {
    constructor(layout, usage) {
        super("ARRAY_BUFFER", usage);

        this.bind();
        let count = { stride: 0, offset: 0 };

        // Step 1: Count the stride... a distance measured in how large (in bytes) each vertex is.
        Object.values(layout).forEach(attributeType => count.stride += attributeType.size);

        // Step 2: For every attribute, in order, do the following:
        // 1) Enable the pointer, 2) Set the pointer, then, 3) Track aggregate size for offset of following attributes.
        let layoutOrder = Object.keys(layout);
        for (let i = 0; i < layoutOrder.length; i++) {
            let attribute = layout[layoutOrder[i]];
            gl.enableVertexAttribArray(i);
            gl.vertexAttribPointer(i, attribute.length, gl[attribute.type], false, count.stride, count.offset);
            count.offset += attribute.size;
        }

        this.unbind();
    }

    // Functions 
    set(data) { super.set(new Float32Array(data)); }
}

// IndexBuffer
class IndexBuffer extends Buffer {
    constructor(usage) { super("ELEMENT_ARRAY_BUFFER", usage); }

    // Functions
    set(data) { super.set(new Uint16Array(data)); }
}