/* ~/Maths.js, Cwebb.
 */

// Imports / Exports
export { lerp, toRadians, toDegrees };

// Vars
const PI = 3.14159265;

// Functions
function lerp(a, b, v) {
    return a + ((b - a) * v);
}

function toDegrees(radians) {
    return radians * (180 / PI);
}

function toRadians(degrees) {
    return degrees * (PI / 180);
}