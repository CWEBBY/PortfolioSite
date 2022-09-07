/* ~/Core/Textures.js, Cwebb.
 */

// Imports / Exports
import { gl } from "./GL/API.js";
export { Texture2D, RenderTexture };

// Texture
class Texture {
    constructor(params = {}) {
        this.id = gl.createTexture();

        this.bind();
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[params?.wrap?.scale || "CLAMP_TO_EDGE"]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[params?.wrap?.translate || "CLAMP_TO_EDGE"]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[params?.filter?.minification || "LINEAR"]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[params?.filter?.magnification || "LINEAR"]);
        this.unbind();
    }

    // Vars
    id;
    width;
    height;

    // Functions
    release() { gl.deleteTexture(this.id); }
    unbind() { gl.bindTexture(gl.TEXTURE_2D, null); }

    bind(slot = 0) {
        gl.activeTexture(gl.TEXTURE0 + slot);
        gl.bindTexture(gl.TEXTURE_2D, this.id);
    }
}

// Texture2D
class Texture2D extends Texture {
    constructor(image, params = {}) {
        super(params);
        this.bind();

        this.width = image.width;
        this.height = image.height;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        this.unbind();
    }

    // Functions
    static fromURL(url, params = {}) {
        return new Promise((res, rej) => {
            let img = new Image();
            img.src = url;
            img.onerror = rej;
            img.onload = () => res(new Texture2D(img, params));
        });
    }
}

// RenderTexture
class RenderTexture extends Texture {
    constructor(width = 1, height = 1, params = {}) {
        super(params);

        this.resize(width, height);
    }

    // Functions 
    resize(width, height) {
        this.bind();
        this.width = width;
        this.height = height;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, Math.max(1, width), Math.max(1, height), 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        this.unbind();
    }
}