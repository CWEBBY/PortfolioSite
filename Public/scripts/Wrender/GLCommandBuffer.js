// Imports / Exports
import { Shader } from "../Wrender/Shader.js";

export { GLCommandBuffer };

// GLCommandBuffer
class GLCommandBuffer {
    constructor() {

    }

    // Vars
    commands = [];

    // Functions
    execute() {
        for (var command of this.commands)
            command();
    }

    clearCommands() { this.commands = []; }

    setStaticInt(name, value) { this.commands.push(() => Shader.setStaticInt(name, value)); }
    setStaticInt2(name, value) { this.commands.push(() => Shader.setStaticInt2(name, value)); }
    setStaticInt3(name, value) { this.commands.push(() => Shader.setStaticInt3(name, value)); }
    setStaticInt4(name, value) { this.commands.push(() => Shader.setStaticInt4(name, value)); }
    setStaticBool(name, value) { this.commands.push(() => Shader.setStaticBool(name, value));}
    setStaticFloat(name, value) { this.commands.push(() => Shader.setStaticFloat(name, value)); }
    setStaticFloat2(name, value) { this.commands.push(() => Shader.setStaticFloat2(name, value)); }
    setStaticFloat3(name, value) { this.commands.push(() => Shader.setStaticFloat3(name, value)); }
    setStaticFloat4(name, value) { this.commands.push(() => Shader.setStaticFloat4(name, value)); }
    setStaticMatrix2x2(name, value) { this.commands.push(() => Shader.setStaticMatrix2x2(name, value)); }
    setStaticMatrix3x3(name, value) { this.commands.push(() => Shader.setStaticMatrix3x3(name, value)); }
    setStaticMatrix4x4(name, value) { this.commands.push(() => Shader.setStaticMatrix4x4(name, value)); }
    setStaticTexture2D(name, texture2D) { this.commands.push(() => Shader.setStaticTexture2D(name, value)); }
}