
import { Vec3 } from "./Vec3.js";
export { Entity };

class Entity {
    constructor(shader, mesh) {
        this.shader = shader;
        this.mesh = mesh;
    }

    // Vars
    translation = new Vec3(0, 0, 0);
    rotation = new Vec3(0, 0, 0);
    scale = new Vec3(1, 1, 1);

    shader;
    mesh;
}