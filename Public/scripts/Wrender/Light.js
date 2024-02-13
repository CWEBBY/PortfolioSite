export { Light };

class Light {
    constructor(transform, color, range) {
        this.transform = transform;
        this.color = color;
        this.range = range;
    }

    // Vars
    transform;
    color;
    range;
}