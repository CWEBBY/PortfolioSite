import { lerp } from "../Wrender/Math.js";
export { Tween };

class Tween {
    constructor(startValue, endValue, seconds, onUpdate) {
        this.startValue = startValue;
        this.endValue = endValue;

        this.onUpdate = onUpdate;

        this.startTime = 
            this.endTime = Date.now();
        this.endTime += seconds * 1000;

        this.onUpdate(this.startValue);
        this.update();
    }

    // Vars
    startValue;
    endValue;

    startTime;
    endTime;

    onUpdate;

    // Functions
    update() {
        if (Date.now() > this.endTime) {
            this.onUpdate(this.endValue);
            return;
        }

        let secondsTotal = this.endTime - this.startTime;
        let secondsCurrent = (this.endTime - Date.now()) / secondsTotal;
        this.onUpdate(lerp(this.endValue, this.startValue, secondsCurrent));

        requestAnimationFrame(() => this.update());
    }
}