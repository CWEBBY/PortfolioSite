/* ~/Maths.js, Cwebb.
 */

// Imports / Exports
export { ortho, lerp };

// Functions
function ortho(left, right, bottom, top, near, far, fov = null) {
    let projSize = { x: right - left, y: top - bottom, z: far - near };
    let projOffset = { x: right + left, y: top + bottom, z: far + near };
    let ndcSize = { x: 2 / projSize.x, y: 2 / projSize.y, z: -2 / projSize.z };

    return [
        ndcSize.x,                      0,                              0,                              0,
        0,                              ndcSize.y,                      0,                              0,
        0,                              0,                              ndcSize.z,                      0,
        -(projOffset.x / projSize.x),   -(projOffset.y / projSize.y),   -(projOffset.z / projSize.z),   1,
    ];
}

function lerp(a, b, v) {
    return a + ((b - a) * v);
}