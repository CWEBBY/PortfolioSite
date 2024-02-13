/* ~/Core/Shader.js, Cwebb.
 */

// Imports / Exports
import { gl } from "./GL/API.js";
export { Shader };

// Vars
const shaders = [];
const includes = {};

// Shader
class Shader {
    constructor(source) {

        // Step 0: Create the program.
        this.id = gl.createProgram();

        // Step 1: Compile all stages and attach.
        for (let stage in source) {
            let shader = gl.createShader(gl[stage]);
            gl.shaderSource(shader, source[stage]);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }

            let lines = source[stage]
                .replace(/\r?\n/, "\n")
                .split(/[{;}]/);

            let attribPtr = 0;
            for (let line in lines) {
                if (lines[line].startsWith("attribute ")) {
                    gl.bindAttribLocation(this.id, attribPtr, lines[line].split(" ").slice(-1));
                    attribPtr++;
                }
            }
                
            gl.attachShader(this.id, shader);
        }

        gl.linkProgram(this.id);
        if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(this.id));
            gl.deleteProgram(this.id);
        }
        else {
            // Step 5: If that worked, get all uniform locations via introspection...
            gl.useProgram(this.id); // Intentionally leave bound for any initial uniform setting right after...
            let uniforms = gl.getProgramParameter(this.id, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < uniforms; i++) { // Auto-cache locations.
                let uniform = gl.getActiveUniform(this.id, i);

                if (uniform.type == gl.SAMPLER_2D) { this.samplers.push(uniform.name); }
                this.uniforms[uniform.name] = gl.getUniformLocation(this.id, uniform.name);
            }
        }

        shaders.push(this);
    }

    // ASYNC. This is the ONLY way to prime the include cache.
    static async fromURL(url) {
        const STAGE_SOURCE = {};

        let fileSource = await fetch(url);
        fileSource = await fileSource.text();
        fileSource = fileSource.split(/\r?\n/);

        let stage = undefined;
        for (let line of fileSource) {
            if (line.startsWith("#shader ")) 
            {
                stage = line.slice("#shader ".length).trim();
                STAGE_SOURCE[stage] = STAGE_SOURCE[stage] || "";
                continue;
            }

            if (line.startsWith("#include ")) {
                line = line.slice("#include ".length)
                    .replace(/\"/g, "").trim();

                if (!includes[line])
                    includes[line] = await (await fetch(line)).text();
                line = includes[line];
            }

            STAGE_SOURCE[stage] += `${line}\n`;
        }

        return new Shader(STAGE_SOURCE);
    }

    // Vars
    id;
    samplers = [];
    uniforms = {};

    // Functions
    unbind() { gl.useProgram(null); }
    bind() { gl.useProgram(this.id); }
    static include(name, source) { includes[name] = source; }

    setInt(name, value) { this.bind(); gl.uniform1i(this.uniforms[name], value); this.unbind(); }
    setInt2(name, value) { this.bind(); gl.uniform2iv(this.uniforms[name], value); this.unbind(); }
    setInt3(name, value) { this.bind(); gl.uniform3iv(this.uniforms[name], value); this.unbind(); }
    setInt4(name, value) { this.bind(); gl.uniform4iv(this.uniforms[name], value); this.unbind(); }
    setBool(name, value) { this.bind(); gl.uniform1i(this.uniforms[name], value); this.unbind(); }
    setFloat(name, value) { this.bind(); gl.uniform1f(this.uniforms[name], value); this.unbind(); }
    setFloat2(name, value) { this.bind(); gl.uniform2fv(this.uniforms[name], value); this.unbind(); }
    setFloat3(name, value) { this.bind(); gl.uniform3fv(this.uniforms[name], value); this.unbind(); }
    setFloat4(name, value) { this.bind(); gl.uniform4fv(this.uniforms[name], value); this.unbind(); }
    setMatrix2x2(name, value) { this.bind(); gl.uniformMatrix2fv(this.uniforms[name], false, value); this.unbind(); }
    setMatrix3x3(name, value) { this.bind(); gl.uniformMatrix3fv(this.uniforms[name], false, value); this.unbind(); }
    setMatrix4x4(name, value) { this.bind(); gl.uniformMatrix4fv(this.uniforms[name], false, value); this.unbind(); }

    setTexture2D(name, texture2D) {
        this.bind();
        this.setInt(name, this.samplers.indexOf(name));
        texture2D.bind(this.samplers.indexOf(name));
        this.unbind();
    }

    static setStaticInt(name, value) { shaders.forEach(shader => shader.setInt(name, value)); }
    static setStaticInt2(name, value) { shaders.forEach(shader => shader.setInt2(name, value)); }
    static setStaticInt3(name, value) { shaders.forEach(shader => shader.setInt3(name, value)); }
    static setStaticInt4(name, value) { shaders.forEach(shader => shader.setInt4(name, value)); }
    static setStaticBool(name, value) { shaders.forEach(shader => shader.setBool(name, value)); }
    static setStaticFloat(name, value) { shaders.forEach(shader => shader.setFloat(name, value)); }
    static setStaticFloat2(name, value) { shaders.forEach(shader => shader.setFloat2(name, value)); }
    static setStaticFloat3(name, value) { shaders.forEach(shader => shader.setFloat3(name, value)); }
    static setStaticFloat4(name, value) { shaders.forEach(shader => shader.setFloat4(name, value)); }
    static setStaticMatrix2x2(name, value) { shaders.forEach(shader => shader.setMatrix2x2(name, value)); }
    static setStaticMatrix3x3(name, value) { shaders.forEach(shader => shader.setMatrix3x3(name, value)); }
    static setStaticMatrix4x4(name, value) { shaders.forEach(shader => shader.setMatrix4x4(name, value)); }

    static setStaticTexture2D(name, texture2D) { shaders.forEach(shader => shader.setTexture2D(name, texture2D)); }
}