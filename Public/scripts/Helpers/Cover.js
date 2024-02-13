export { Cover };

class Cover {
    constructor(params = {}) {
        this.title = params["title"];
        this.subtitle = params["subtitle"];
    }

    // Vars
    title;
    subtitle;

    // Functions
    render() { // this is the default...

    }
}