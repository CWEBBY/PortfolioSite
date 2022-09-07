/* main.js, Cwebb.
 */

// Imports / Exports
import * as Banner from "./helpers/banner.js";
import { Typewriter } from "./helpers/typewriter.js";

// Step 0: Ugly chunk of script for basic form feedback until I implement recaptcha.
if (window.location.search.length > 1 && window.location.search.includes("message=success"))
    alert("Your message was sent successfully, I'll get back to you as soon as I can. -CW");

// Step 1: Set all of certain element types to certain state.
document.querySelector("#contactButton").addEventListener("click", () => document.querySelector("#contactForm").submit());
document.querySelectorAll(".onlyScript").forEach(onlyScript => onlyScript.style.display = "block");
document.querySelectorAll(".noScript").forEach(noScript => noScript.style.display = "none");
document.querySelectorAll(".toggle").forEach(toggle => {
    toggle.addEventListener('click', () => toggle.classList.toggle('toggled'));
    toggle.classList.remove('toggled');
});

// Step 2: Find the element for the navigation background and hook it to the scroll event for opacity lerping.
let navigationBackground = document.getElementById('navigationBackground');
if (navigationBackground) {
	let scroll = () => navigationBackground.style.opacity = Math.max(0, Math.min(1, window.pageYOffset / (1080 / 2)));
    window.addEventListener('scroll', scroll);
    scroll();
}

// Step 3: Initialize the name tag typewriters.
const title = new Typewriter(document.getElementById("headerTitle"));
const subtitle = new Typewriter(document.getElementById("headerSubtitle"), [
    "Software Engineer", "Game Developer", "Game Designer", "Git Commiter", 
    "Web Developer", "Network Administrator", "Car Enthusiast", "Tabs User", 
    "Coffee Drinker", "Night Owl", "PC Builder", "System Designer", "CWEBBY", 
    "Pizza Expert", "DIY-er", "Visual FX Programmer", "Masters Graduate", "Code Cowboy",
    "Overclocker", "Modder", "Matrix Multiplier", "Raytracer", "camelCaseUser", "Grease Monkey"
]);

// Step 4: Wait for the init of all of the GL state. See "./helpers/gl.js" for implementation...
await Banner.init("headerGL");

// Step 5: Button binding, aka, the step where hell breaks loose... 
let btns = [];
let dock = {
    base: document.getElementById("headerDock"),
    showcase: document.createElement('div')
};

Object.keys(Banner.covers).forEach(effect => {
    let btn = document.createElement("div");
    btn.classList.add("radio");
    btn.id = effect;
    btns.push(btn);

    btn.addEventListener('click', () => {
        if (btn.classList.contains("active")) return;

        if (Banner.descriptions[effect]) {
            title.content = effect;
            subtitle.content = Banner.descriptions[effect];
        }
        else {
            if (subtitle.locked) subtitle.content = null;
            if (title.content != "Christopher Webb") title.content = "Christopher Webb";
        }

        btns.forEach(btn => btn.classList.remove("active"));
        btn.classList.add("active");

        Banner.select(effect);
    });

    if (Banner.descriptions[effect]) dock.showcase.appendChild(btn);
    else dock.base.appendChild(btn);
});

dock.showcase.classList.add("showcase");
dock.base.appendChild(dock.showcase);

// Step 6: Pick the first effect...
document.getElementById("Hexes").click();