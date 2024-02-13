// Imports / Exports
import { Clock } from "./Clock.js";
import { Vec3 } from "../Wrender/Vec3.js";
import { Mesh } from "../Wrender/Mesh.js";
import { Tween } from "../Helpers/Tween.js";
import { Scene } from "../Wrender/Scene.js";
import { Entity } from "../Wrender/Entity.js";
import { PerspectiveCamera, OrthographicCamera } from "../Wrender/Camera.js";
import { Shader } from "../Wrender/Shader.js";
import { toRadians } from "../Wrender/Math.js";
import { Context } from "../Wrender/Context.js";
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

async function initResources(banner) {
    banner.context = new Context(banner.canvas);
    banner.covers = [];

    for (let shader of [ // Step 1: set up shaders and lambdas.
        await Shader.fromURL("./resources/gl/shaders/Hexes.glsl"),
        await Shader.fromURL("./resources/gl/shaders/Neurons.glsl"),
        await Shader.fromURL("./resources/gl/shaders/Rain.glsl"),
        await Shader.fromURL("./resources/gl/shaders/Fire.glsl"),
        await Shader.fromURL("./resources/gl/shaders/Smoke.glsl"),
    ]) { banner.covers.push(() => banner.context.blit(shader)); }

    // Step 2: Add more verbose covers.
    let leaderF16 = null;
    let leftF16 = null;
    let rightF16 = null;

    let f16Mesh = await Mesh.fromURL("./resources/gl/objects/F16.obj");
    let testShader = await Shader.fromURL("./resources/gl/shaders/TestShader.glsl");


    let camera = new OrthographicCamera(banner.context, { nearClip: 0, farClip: 100, size: 10 });
    let scene = new Scene({ 
        entities: [
            leaderF16 = new Entity(testShader, f16Mesh),
            leftF16 = new Entity(testShader, f16Mesh),
            rightF16 = new Entity(testShader, f16Mesh),
        ]
    });

    banner.covers.push(() => {
        leaderF16.rotation = new Vec3(toRadians(-30 + Math.sin(Clock.current)), toRadians(-90 + + Math.sin(Clock.current)), toRadians(-60 + Math.sin(Clock.current)));
        leftF16.rotation = new Vec3(toRadians(-30 + Math.sin(Clock.current)), toRadians(-90 + + Math.sin(Clock.current)), toRadians(-60 + Math.sin(Clock.current)));
        rightF16.rotation = new Vec3(toRadians(-30 + Math.sin(Clock.current)), toRadians(-90 + + Math.sin(Clock.current)), toRadians(-60 + Math.sin(Clock.current)));


        leaderF16.rotation.z += Math.sin(Clock.current) * .5;
        leftF16.rotation.z += Math.sin(Clock.current - Math.sin(Clock.current * 2)) * .25;
        rightF16.rotation.z += Math.sin(Clock.current - Math.cos(Clock.current * 2)) * .125;

        leaderF16.translation = new Vec3(-2 + (Math.sin(Clock.current / 1.15) / 2), 2 + (Math.sin(Clock.current / 3) / 2), 50);
        leftF16.translation = new Vec3(2 + (Math.sin(Clock.current / 1.15) / 2), 1 + (Math.sin(Clock.current / 3) / 2), 55);
        rightF16.translation = new Vec3(1 + (Math.sin(Clock.current / 1.15) / 2), -1 + (Math.sin(Clock.current / 3) / 2), 60);
        camera.render(scene);
    });

    let btns = [];
    let dock = {
        base: document.getElementById("headerDock"),
        showcase: document.createElement('div')
    };

    banner.covers.forEach((effect, index) => {
        let btn = document.createElement("div");
        btn.classList.add("radio");
        btn.id = effect;
        btns.push(btn);

        btn.addEventListener('click', () => {
            if (btn.classList.contains("active"))
                return;

            banner.subtitle.content = null;

            btns.forEach(btn => btn.classList.remove("active"));
            btn.classList.add("active");
            banner.cover = index;
        });

        dock.base.appendChild(btn);
    });

    dock.showcase.classList.add("showcase");
    dock.base.appendChild(dock.showcase);

    new Tween(0, 1, 1, value => banner.canvas.style.opacity = value.toString());
    btns[0].click();
    banner.render();
};

class Banner {
    constructor(canvas) {
        this.canvas = canvas;
        this.title = new Typewriter(document.getElementById("headerTitle"))
        this.subtitle = new Typewriter(document.getElementById("headerSubtitle"), DESCRIPTIONS)
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
    cover;

    // Functions
    render() {
        Shader.setStaticFloat2("RESOLUTION",
            [this.canvas.width, this.canvas.height]);
        Shader.setStaticFloat("TIME", Clock.current)

        this.covers[this.cover]();
        this.frameID = requestAnimationFrame(() => this.render());
    }
}