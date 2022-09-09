/* ~/Core/GL/Enums.js, Cwebb.
 */

// Imports / Exports
export { GLFloat, GLInt };

// Vars
const GL_PRECISION = 32;

// Functions
function GLTYPE(type, components) { return { type: type, length: components, size: components * (GL_PRECISION / 8) }; }
function GLFloat(components) { return GLTYPE("FLOAT", Math.max(1, Math.min(4, components))) }
function GLInt(components) { return GLTYPE("INT", Math.max(1, Math.min(4, components))) }