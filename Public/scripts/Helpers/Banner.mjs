/* ~/Helpers/GL.js, Cwebb.
 */

// #TODO: TAA
// #TODO: Path tracing
// #TODO: Implement DRS loop for undertarget FPS path tracing

// Imports / Exports
import { Clock } from "./Clock.mjs";
import { Shader } from "../Wrender/Shader.mjs";
import { Context } from "../Wrender/Context.mjs";
import { Renderer } from "../Wrender/Renderer.mjs";
import { Texture2D } from "../Wrender/Textures.mjs";
import { PostPass } from "../Wrender/RenderPasses.mjs";
import { FrameBuffer } from "../Wrender/Framebuffer.mjs";
export { covers, descriptions, init, select };

// Vars
let covers = {};
let textures = {};
let context = null;
let effectBuffer = null;
let cameraYRotation = 0;
let cover = { id: null, frameRequest: null };
let swipe = { active: false, start: 0, current: 50 };

const descriptions = {
    "A Late Night": "A from scratch, ray-traced global illumination rendering showcase.",
    "Cornell Box": "The one, the only, the original ray-traced global illumination testbed.",
    "Mesh Tracing": "A from scratch, ray traced, physically based rendering showcase."
}

// Functions
async function initIncludes() {
    for await (const name of ["Lighting", "Raytracing", "Random", "Auto", "SDFs"])
        Shader.include(name, await (await fetch("./resources/gl/includes/" + name + ".inc")).text());
}

async function initTextures() {
    for await (const name of ["evo_ALB", "wood_ALB", "wood_NRM", "wood_GLOSS", "vapourwave_ALB", "bunny_VERT"])
        textures[name] = await Texture2D.fromURL("./resources/images/gltextures/" + name + ".png");
}

async function initRenderers() {
    for await (const name of ["Hexes", "Neurons", "Rain", "Fire", "Smoke"]) {
        let effectShader = new Shader(await (await fetch("./resources/gl/shaders/"+ name +".glsl")).text())
        // Fun fact: the more I make of these, the more memory I use. Each is 2x the renderer's viewport size, minimum.
        covers[name] = new Renderer(context); // Maybe a 'enable / disable pass' system for ONE renderer and centralise that?
        covers[name].addRenderPass(new PostPass(effectShader));
    }

    // The good stuff comes next...
    effectBuffer = new FrameBuffer(context.canvas.width, context.canvas.height);

    covers["A Late Night"] = new Renderer(context);

    // Step 1:
    let basePass = new Shader(await (await fetch("./resources/gl/shaders/ALateNight.glsl")).text());
    covers["A Late Night"].addRenderPass(new PostPass(basePass,
        () => {
            effectBuffer.bind();

            basePass.setTexture2D("u_evoBadgeTex", textures.evo_ALB);
            basePass.setTexture2D("u_vapourwaveTex", textures.vapourwave_ALB);

            basePass.setTexture2D("u_woodgrainAlbedoTex", textures.wood_ALB);
            basePass.setTexture2D("u_woodgrainNormalTex", textures.wood_NRM);
            basePass.setTexture2D("u_woodgrainGlossTex", textures.wood_GLOSS);

            cameraYRotation += Clock.delta * ((swipe.start - swipe.current) * .01);
            basePass.setInt("u_ReflectionsEnabled", window.innerWidth < 720 ? 0 : 1);
            basePass.setInt("u_ShadowsEnabled", window.innerWidth < 480 ? 0 : 1);

            var lightGlow = { "r": 1 - (Math.sin(Clock.delta) + 1) * .25, "g": 1 - (Math.sin(Clock.delta) + .75) * .25, "b": 1 - (Math.sin(Clock.delta) + .5) * .25 };
            var lightBob = { "x": Math.sin(Clock.delta * 1.8435498), "y": Math.sin(Clock.delta * 1.8435498), "z": Math.sin(Clock.delta * 0.71651351681) };
            basePass.setFloat3("u_LightPositions[0]", [-7.5 + lightBob.x, 20 + lightBob.y, 7.5 + lightBob.z])
            basePass.setFloat3("u_LightColors[0]", [2 * lightGlow.r, 1.5 * lightGlow.g, 1 * lightGlow.b])
            basePass.setFloat("u_rotation", cameraYRotation);
        },
        () => effectBuffer.unbind()
    ));

    // Step 2:
    let highFilterPass = new Shader(await (await fetch("./resources/gl/shaders/HighPassFilter.glsl")).text());
    covers["A Late Night"].addRenderPass(new PostPass(highFilterPass, () => {
        highFilterPass.setTexture2D("u_MainTex", effectBuffer.renderTexture);
        highFilterPass.setFloat("u_Threshold", 0);
        highFilterPass.setFloat("u_Range", 0);
    }));

    // Step 3:
    let diffusionPasses = 8;
    let diffusionPass = new Shader(await (await fetch("./resources/gl/shaders/GBlur.glsl")).text());
    for (let i = 0; i < diffusionPasses - 1; i++) {
        covers["A Late Night"].addRenderPass(new PostPass(diffusionPass, () => {
            var xAxis = i % 2 > 0;
            diffusionPass.setFloat2("u_Amount", [xAxis ? .25 : 0, xAxis ? 0 : .25]);
            diffusionPass.setTexture2D("u_MainTex", covers["A Late Night"].backBuffer.renderTexture);
        }));
    }

    // Step 4: 
    let additiveBlitShader = new Shader(await (await fetch("./resources/gl/shaders/AdditiveBlit.glsl")).text());
    covers["A Late Night"].addRenderPass(new PostPass(additiveBlitShader, () => {
        additiveBlitShader.setTexture2D("u_AddTex", covers["A Late Night"].backBuffer.renderTexture);
        additiveBlitShader.setTexture2D("u_MainTex", effectBuffer.renderTexture);
    }));

    // Step 5:
    let chromabShader = new Shader(await (await fetch("./resources/gl/shaders/Chromab.glsl")).text());
    covers["A Late Night"].addRenderPass(new PostPass(chromabShader, () => {
        chromabShader.setFloat("u_Offset", .002 * Math.sin(Clock.current));
        chromabShader.setTexture2D("u_MainTex", covers["A Late Night"].backBuffer.renderTexture);
    }));

    // Step 6:
    let fxaaShader = new Shader(await (await fetch("./resources/gl/shaders/FXAA.glsl")).text());
    covers["A Late Night"].addRenderPass(new PostPass(fxaaShader, () => {
        fxaaShader.setFloat("u_Strength", 512);
        fxaaShader.setTexture2D("u_MainTex", covers["A Late Night"].backBuffer.renderTexture);
    })); 
}

async function initResources(canvasID) {
    context = new Context(canvasID, { scale: 1 });
    await initIncludes();
    await initTextures();
    await initRenderers();
    select(cover.id);
}

async function init(canvasID) {
    await initResources(canvasID);

    // Events
    // Input
    function addInput(name, action) { context.canvas.addEventListener(name, (event) => action(event)); }
    ["mouseup", "touchend", "touchcancel"].forEach(event => addInput(event, (e) => swipe.active = false));
    ["mousemove", "touchmove"].forEach(event => addInput(event, (e) => swipe.current = swipe.active ? e.clientX : swipe.current));
    ["mousedown", "touchstart"].forEach(event => addInput(event, (e) => {
        if (!descriptions[cover.id]) return; // Don't care about input unless it's 'cool' input.
        swipe.active = true;
        swipe.start = e.clientX;
        swipe.current = e.clientX;
    }));

    // Context
    context.canvas.addEventListener("webglcontextrestored", async () => await initResources(canvasID));
    context.canvas.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        updateID = cancelAnimationFrame(updateID);
    });

    fadeIn();
}

function fadeIn(initTime = Date.now()) {
    let tDelta = (Date.now() - initTime) / 1000;
    context.canvas.style.opacity = tDelta.toString()
    if (tDelta < 1) requestAnimationFrame(() => fadeIn(initTime));
}

function select(name) {
    if (!name) return;
    cover.id = name;
    if (!cover.updateID) render();
}

function render() {
    covers[cover.id].render();
    cover.updateID = requestAnimationFrame(render);
}