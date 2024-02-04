// Imports / Exports
import { Tween } from "../Helpers/Tween.js";
import { Shader } from "../Wrender/Shader.js";
import { Context } from "../Wrender/Context.js";
import { PostPass } from "../Wrender/PostPass.js";
import { Texture2D } from "../Wrender/Textures.js";
import { Typewriter } from "../Helpers/Typewriter.js";

export { Banner };

const DESCRIPTIONS = [
    "Software Engineer", "Game Developer", "Game Designer", "Git Commiter",
    "Web Developer", "Network Administrator", "Car Enthusiast", "Tabs, not spaces...",
    "Pizza Expert", "DIY-er", "Visual FX Programmer", "Masters Graduate", "Code Cowboy",
    "Coffee Drinker", "Night Owl", "PC Builder", "System Designer", "CWEBBY", "Plant Father",
    "Overclocker", "Modder", "Matrix Multiplier", "Raytracer", "camelCaseUser", "Grease Monkey"
];

const DEMONSTRATIONS = {
    "MeshTracing": { title: "Mesh Tracing", subtitle: "A from scratch, ray traced, physically based rendering showcase." },
    "ALateNight": { title: "A Late Night", subtitle: "A from scratch, ray-traced global illumination rendering showcase." },
};

async function initResources(banner) {
    banner.context = new Context(banner.canvas, { scale: 1 });

    var aLateNight = [];
    banner.renderPasses = [
        new PostPass(await Shader.fromURL("./resources/gl/shaders/Hexes.glsl")),
        new PostPass(await Shader.fromURL("./resources/gl/shaders/Neurons.glsl")),
        new PostPass(await Shader.fromURL("./resources/gl/shaders/Rain.glsl")),
        new PostPass(await Shader.fromURL("./resources/gl/shaders/Fire.glsl")),
        aLateNight = new PostPass(await Shader.fromURL("./resources/gl/shaders/Smoke.glsl")),

        //aLateNight = new PostPass(await Shader.from("./resources/gl/shaders/ALateNight.glsl")),
    ];

    //aLateNight.settexture...

    banner.postProcessingEnabled = false;
    banner.postPasses = {};

    let btns = [];
    let dock = {
        base: document.getElementById("headerDock"),
        showcase: document.createElement('div')
    };

    banner.renderPasses.forEach(effect => {
        let btn = document.createElement("div");
        btn.classList.add("radio");
        btn.id = effect;
        btns.push(btn);

        if (aLateNight == effect) dock.showcase.appendChild(btn);
        else dock.base.appendChild(btn);
    });

    dock.showcase.classList.add("showcase");
    dock.base.appendChild(dock.showcase);

    new Tween(0, 1, 1, value => banner.canvas.style.opacity = value.toString());
    banner.render();
};

class Banner {
    constructor(canvas) {
        this.canvas = canvas;
        this.descriptions = DESCRIPTIONS;

        this.title = new Typewriter(document.getElementById("headerTitle"))
        this.subtitle = new Typewriter(document.getElementById("headerSubtitle"))

        canvas.addEventListener("webglcontextrestored", async () => await initResources(this));
        canvas.addEventListener("webglcontextlost", e => {
            cancelAnimationFrame(this.frameID);
            e.preventDefault();
        });

        initResources(this);
    }

    // Vars
    frameID;

    canvas;
    context;

    title;
    subtitle;
    descriptions;

    postPasses;
    renderPasses;
    postProcessingEnabled;

    // Functions
    render() {
        //renderPasses.render();

        if (this.postProcessingEnabled) {

        }

        this.frameID = requestAnimationFrame(() => this.render());
    }
}






//// Step 6: Pick the first effect...
//document.getElementById("Hexes").click();