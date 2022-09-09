/* ~/Input.js, Cwebby.
 */

// Imports / Exports
export { DragHandler };

class DragHandler {
    constructor(htmlElement) {
        ["mousedown", "touchstart"].forEach(eventName => {
            htmlElement.addEventListener(eventName, eventHandler => {
                this.isDragging = true;
                this.currentPosition = this.currentPosition = {
                    x: eventHandler.clientX,
                    y: eventHandler.clientY
                };
            });
        });

        ["mousemove", "touchmove"].forEach(eventName => {
            htmlElement.addEventListener(eventName, eventHandler => {
                this.currentPosition = {
                    x: eventHandler.clientX,
                    y: eventHandler.clientY
                };
            });
        });

        ["mouseup", "touchend", "touchcancel"].forEach(eventName => {
            htmlElement.addEventListener(eventName, eventHandler => {
                this.isDragging = false;
            });
        });
    } 

    // Vars
    currentPosition;
    startPosition;

    isDragging; 

    // Properties
    get delta() {
        return !this.isDragging ? { x: 0, y: 0 } : {
            x: this.startPosition.x - this.currentPosition.x, 
            y: this.startPosition.y - this.currentPosition.y
        };
    }
}