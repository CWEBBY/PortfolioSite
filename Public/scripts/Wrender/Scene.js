// Scene.js, cwebby
export { Scene }

class Scene {
    constructor(params = {}) {
        this.entities = params["entities"] || [];
        this.lights = params["lights"] || [];
    }

    // Vars
    entities;
    lights;
}