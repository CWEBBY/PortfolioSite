export { Mat4x4 };

class Mat4x4 {
    constructor(elements = [ // Identity.
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    ]) { this.elements = elements; }

    static ortho(left, right, bottom, top, near, far) {
        return new Mat4x4([
            2 / (right - left), 0, 0, -((right + left) / (right - left)),
            0, 2 / (top - bottom), 0, -((top + bottom) / (top - bottom)),
            0, 0, 2 / (far - near), -((far + near) / (far - near)),
            0, 0, 0, 1
        ]);
    }

    static perspective(aspectRatio, fov, near, far) {
        return new Mat4x4([
            1 / (aspectRatio * Math.tan(fov / 2)), 0, 0, 0,
            0,  1 / Math.tan(fov / 2), 0, 0,
            0,  0, -((far + near) / (far - near)), -((2 * far * near) / (far - near)),
            0,  0, -1, 0
        ]);
    }

    static Translation(vec3) {
        return new Mat4x4([
            1, 0, 0, vec3.x,
            0, 1, 0, vec3.y,
            0, 0, 1, vec3.z,
            0, 0, 0, 1,
        ]);
    }

    static Rotation(vec3) { // REPLACE THIS WITH QUATS
        let xy = new Mat4x4();
        let xyz = new Mat4x4();

        Mat4x4.multiply(xy,
            new Mat4x4([
                Math.cos(vec3.y), 0, Math.sin(vec3.y), 0,
                0, 1, 0, 0,
                -Math.sin(vec3.y), 0, Math.cos(vec3.y), 0,
                0, 0, 0, 1,
            ]),

            new Mat4x4([
                1, 0, 0, 0,
                0, Math.cos(vec3.x), -Math.sin(vec3.x), 0,
                0, Math.sin(vec3.x), Math.cos(vec3.x), 0,
                0, 0, 0, 1,
            ]),
        )

        Mat4x4.multiply(xyz, xy,
            new Mat4x4([
                Math.cos(vec3.z), -Math.sin(vec3.z), 0, 0,
                Math.sin(vec3.z), Math.cos(vec3.z), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ]),
        )

        return xyz;
    }

    static Scale(vec3) {
        return new Mat4x4([
            vec3.x, 0, 0, 0,
            0, vec3.y, 0, 0,
            0, 0, vec3.z, 0,
            0, 0,      0, 1,
        ]);
    }

    static multiply(out, left, right) {
        out.elements = [ // this is hardcoded for the moment...
            (left.elements[0] * right.elements[0]) + (left.elements[1] * right.elements[4]) + (left.elements[2] * right.elements[8]) + (left.elements[3] * right.elements[12]),
            (left.elements[0] * right.elements[1]) + (left.elements[1] * right.elements[5]) + (left.elements[2] * right.elements[9]) + (left.elements[3] * right.elements[13]),
            (left.elements[0] * right.elements[2]) + (left.elements[1] * right.elements[6]) + (left.elements[2] * right.elements[10]) + (left.elements[3] * right.elements[14]),
            (left.elements[0] * right.elements[3]) + (left.elements[1] * right.elements[7]) + (left.elements[2] * right.elements[11]) + (left.elements[3] * right.elements[15]),
            (left.elements[4] * right.elements[0]) + (left.elements[5] * right.elements[4]) + (left.elements[6] * right.elements[8]) + (left.elements[7] * right.elements[12]),
            (left.elements[4] * right.elements[1]) + (left.elements[5] * right.elements[5]) + (left.elements[6] * right.elements[9]) + (left.elements[7] * right.elements[13]),
            (left.elements[4] * right.elements[2]) + (left.elements[5] * right.elements[6]) + (left.elements[6] * right.elements[10]) + (left.elements[7] * right.elements[14]),
            (left.elements[4] * right.elements[3]) + (left.elements[5] * right.elements[7]) + (left.elements[6] * right.elements[11]) + (left.elements[7] * right.elements[15]),
            (left.elements[8] * right.elements[0]) + (left.elements[9] * right.elements[4]) + (left.elements[10] * right.elements[8]) + (left.elements[11] * right.elements[12]),
            (left.elements[8] * right.elements[1]) + (left.elements[9] * right.elements[5]) + (left.elements[10] * right.elements[9]) + (left.elements[11] * right.elements[13]),
            (left.elements[8] * right.elements[2]) + (left.elements[9] * right.elements[6]) + (left.elements[10] * right.elements[10]) + (left.elements[11] * right.elements[14]),
            (left.elements[8] * right.elements[3]) + (left.elements[9] * right.elements[7]) + (left.elements[10] * right.elements[11]) + (left.elements[11] * right.elements[15]),
            (left.elements[12] * right.elements[0]) + (left.elements[13] * right.elements[4]) + (left.elements[14] * right.elements[8]) + (left.elements[15] * right.elements[12]),
            (left.elements[12] * right.elements[1]) + (left.elements[13] * right.elements[5]) + (left.elements[14] * right.elements[9]) + (left.elements[15] * right.elements[13]),
            (left.elements[12] * right.elements[2]) + (left.elements[13] * right.elements[6]) + (left.elements[14] * right.elements[10]) + (left.elements[15] * right.elements[14]),
            (left.elements[12] * right.elements[3]) + (left.elements[13] * right.elements[7]) + (left.elements[14] * right.elements[11]) + (left.elements[15] * right.elements[15]),
        ];
    }

    static add(out, ...mats) {
        for (let mat of mats) {
            for (let i = 0; i < 16; i++)
                out.elements[i] += mat.elements[i];
        }
    }

    static subtract(out, ...mats) {
        for (let mat of mats) {
            for (let i = 0; i < 16; i++)
                out.elements[i] -= mat.elements[i];
        }
    }

    // Vars
    elements;

    // Properties
    get array() { return this.elements; }
}