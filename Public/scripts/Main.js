// Imports / Exports
import { Banner } from "./Helpers/Banner.js";

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

// Step 3: Initialize the banner.
new Banner(document.getElementById("headerGL"));