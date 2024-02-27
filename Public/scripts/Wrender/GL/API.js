/* ~/Core/GL/API.js, Cwebb.
 */

// Imports / Exports
export { gl, glBind, glViewport, glClear, glDraw };

// Vars
let gl = null;

// Functions
function glBind(canvas, params = {}) {
    gl = canvas.getContext('webgl', params);
    gl.enable(gl.SCISSOR_TEST);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function glViewport(x, y, width, height) {
    gl.viewport(x, y, width, height);
    gl.scissor(x, y, width, height);
}

function glClear(r = 0, g = 0, b = 0, a = 0) {
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function glDraw(count = 0) { gl.drawArrays(gl.TRIANGLES, 0, count); }