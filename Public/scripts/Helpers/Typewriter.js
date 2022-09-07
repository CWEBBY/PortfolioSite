/* ~/Helpers/Typewriter.js, Cwebb.
 */


// Imports / Exports
import { Clock } from "./Clock.js";
export { Typewriter };

// Typewriter
 class Typewriter {
    constructor(element, phrases = [], params = {}) {
        this.phrases = phrases;
        this.element = element;
        this.params = params;
        this.content = null;
    }

    // Vars
    phrases;
    element;
    params;
    updateID;
    target;

    // Properties
    get content() { return this.target; }
    set content(value) {
        cancelAnimationFrame(this.updateID);
        this.target = value;
        this.locked = value;
        this.type(value);
    }

     // Functions
     backspace(value, startTime = Clock.current) {
        let duration = (this.params.backspacing || 2);
        let progress = (Clock.current - startTime) / duration;

        this.element.innerText = value.substring(0, value.length - Math.floor(progress * value.length)) + (this.params.cursor || "|");
        if (progress > 1) this.updateID = requestAnimationFrame(() => this.type());
        else this.updateID = requestAnimationFrame(() => this.backspace(value, startTime));
    }

    wait(value, startTime = Clock.current) {
        let duration = (this.params.waiting || 3);
        let progress = (Clock.current - startTime) / duration;

        this.element.innerText = value + ((progress * duration) % 1 > .5 ? "" : (this.params.cursor || "|"));
        if (progress > 1) this.updateID = requestAnimationFrame(() => this.backspace(value));
        else this.updateID = requestAnimationFrame(() => this.wait(value, startTime));
    }

    type(value, startTime = Clock.current) {
        if (!value) {
            if (this.phrases.length < 1) return;
            else {
                value = this.phrases[Math.floor(Math.random() * this.phrases.length)];
                this.target = value;
            }
        }

        let duration = (this.params.typing || 1);
        let progress = (Clock.current - startTime) / duration;

        this.element.innerText = value.substring(0, Math.floor(progress * value.length)) + (this.params.cursor || "|");
        if (progress <= 1) this.updateID = requestAnimationFrame(() => this.type(value, startTime));
        else {
            if (!this.locked) this.updateID = requestAnimationFrame(() => this.wait(value));
            else this.element.innerText = value.substring(0, Math.floor(progress * value.length));
        }
    }
}