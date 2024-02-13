// Mesh.js, cwebby
import { VertexArray } from "./VertexArray.js";
import { GLFloat } from "./GL/Enums.js";
export { Mesh };

class Mesh {
    constructor(attributes = [], indicies = []) {
        this.vertexArray = new VertexArray({ a_Position: GLFloat(3), a_Texcoords: GLFloat(2) });
        this.vertexArray.attributes.set(attributes);
        this.vertexArray.indicies.set(indicies);
    }

	// Vars
	vertexArray;

	// Functions
    static async fromURL(url) {
        let file = await fetch(url);
        file = await file.text();
        file = file.split(/\r?\n/);

        let attributes = [0, 0, 0, 0, 0];
        let indicies = [];


        for (let line of file) {
            if (line.startsWith("v ")) {
                let args = line.split(/\s/);
                attributes.push(Number(args[1]));
                attributes.push(Number(args[2]));
                attributes.push(Number(args[3]));
                attributes.push(0);
                attributes.push(1);
                continue;
            }

            if (line.startsWith("f")) {
                let args = line.split(/\s+/);
                indicies.push(Number(args[1].split("/")[0]));
                indicies.push(Number(args[2].split("/")[0]));
                indicies.push(Number(args[3].split("/")[0]));
                continue;
            }
        }

        return new Mesh(attributes, indicies);
    }
}