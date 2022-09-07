/* ~/Clock.js, Cwebb.
 */

// Vars
const startTime = Date.now();
let current = 0;
let delta = 0;

// Functions
function tick() {
    let now = (Date.now() - startTime) / 1000;
    delta = now - current;
    current = now;
    requestAnimationFrame(tick);
}

// Clock
export class Clock {
    // Properties
    static get start() { return startTime; }
    static get current() { return current; }
    static get delta() { return delta; }
}

tick();