/* ~/Core/Shader.js, Cwebb.
 */

// Imports / Exports
import { gl } from "./GL/API.mjs";
export { Shader };

// Vars
const includes = {};

// Functions
function parseShaderDefine(define) {
    switch (define.toLowerCase()) {
        case "v": case "vert": case "vertex":
            return "VERTEX_SHADER"; break;
        case "f": case "frag": case "fragment": case "pixel":
            return "FRAGMENT_SHADER"; break;
        default: console.warn("Shader type [" + shaderDef + "] not supported"); break;
    }
}

function parseShader(string) {
    let attributes = [];
    let slots = [];
    let stages = {};
    let stage = null;

    string.split("\r\n").forEach(line => {
        if (line.includes("#shader")) {
            let shaderDef = line.replace("#shader", "").trim();
            stage = parseShaderDefine(shaderDef);
        }
        else if (line.includes("#include")) {
            let include = parseInclude(line.replace("#include", "").trim());
            stages[stage] = stages[stage] ?
                stages[stage] + include + "\n" :
                include;
        }
        else stages[stage] = stages[stage] ? stages[stage] + line + "\n" : line;
        if (line.includes("attribute")) attributes.push(line.split(" ")[2].replace(";", ""));
        if (line.includes("sampler2D")) slots.push(line.split(" ")[2].replace(";", ""));
    });

    return { attributes, slots, stages };
}

function parseInclude(name) {
    let lines = [];
    let parsed = [];
    if (includes[name]) lines = includes[name].split("\r\n");

    for (let line in lines) {
        let unparsed = lines[line];
        if (unparsed.includes("#include"))
            parsed += parseInclude(unparsed.replace("#include", "").trim());
        else parsed += lines[line];
        parsed += "\n";
    }

    return parsed;
}

// Shader
class Shader {
    constructor(source) {
        // Step 0: Create the program.
        this.id = gl.createProgram();

        // Step 1: Parse the source string into stages [vert/frag/etc], attributes and tex slots...
        source = parseShader(source);

        // Step 2: Compile all stages and attach.
        for (let type in source.stages) {
            let stage = gl.createShader(gl[type]);

            gl.shaderSource(stage, source.stages[type]);
            gl.compileShader(stage);

            if (!gl.getShaderParameter(stage, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(stage));
                gl.deleteShader(stage);
            }
            else gl.attachShader(this.id, stage);
        }

        // Step 3: A WGLv1 workaround to WGLv2 layouts. 
        // To enable my vert array class to work, attributes are given a location from their order in declaration.
        for (let attribute in source.attributes)
            gl.bindAttribLocation(this.id, attribute, source.attributes[attribute]);

        // Step 3: A quick auto slot assignment for textures...
        let textures = Object.values(source.slots);
        for (let slot = 0; slot < textures.length; slot++) this.slots[textures[slot]] = slot;

        // Step 4: Link stages, or delete a stage and hope the shader still runs.
        gl.linkProgram(this.id);
        if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(this.id));
            gl.deleteProgram(this.id);
        }
        else {
            // Step 5: If that worked, get all uniform locations via introspection...
            gl.useProgram(this.id); // Intentionally leave bound for any initial uniform setting right after...
            let uniformCount = gl.getProgramParameter(this.id, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < uniformCount; i++) { // Auto-cache locations.
                let name = gl.getActiveUniform(this.id, i).name;
                this.uniforms[name] = gl.getUniformLocation(this.id, name);
            }
        }
    }

    // Vars
    id;
    slots = {};
    uniforms = {};

    // Functions
    unbind() { gl.useProgram(null); }
    bind() { gl.useProgram(this.id); }
    static include(name, source) { includes[name] = source; }

    setInt(name, value)         { gl.uniform1i(this.uniforms[name], value)  }
    setInt2(name, value)        { gl.uniform2iv(this.uniforms[name], value) }
    setInt3(name, value)        { gl.uniform3iv(this.uniforms[name], value) }
    setInt4(name, value)        { gl.uniform4iv(this.uniforms[name], value) }
    setBool(name, value)        { gl.uniform1i(this.uniforms[name], value)  }
    setFloat(name, value)       { gl.uniform1f(this.uniforms[name], value)  }
    setFloat2(name, value)      { gl.uniform2fv(this.uniforms[name], value) }
    setFloat3(name, value)      { gl.uniform3fv(this.uniforms[name], value) }
    setFloat4(name, value)      { gl.uniform4fv(this.uniforms[name], value) }
    setMatrix2x2(name, value)   { gl.uniformMatrix2fv(this.uniforms[name], false, value) }
    setMatrix3x3(name, value)   { gl.uniformMatrix3fv(this.uniforms[name], false, value) }
    setMatrix4x4(name, value)   { gl.uniformMatrix4fv(this.uniforms[name], false, value) }

    setTexture2D(name, texture2D) {
        this.setInt(name, this.slots[name]);
        texture2D.bind(this.slots[name]);
    }
}