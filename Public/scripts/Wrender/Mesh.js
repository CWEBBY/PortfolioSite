// Mesh.js, cwebby
import { VertexArray } from "./VertexArray.js";
import { GLFloat } from "./GL/Enums.js";
export { Mesh };

class Mesh {
    constructor(attributes = []) {
        this.vertexArray = new VertexArray({ a_Position: GLFloat(3), a_Normal: GLFloat(3)/*, a_Texcoords: GLFloat(2)*/ });
        this.vertexArray.attributes.set(attributes);
    }

	// Vars
	vertexArray;

	// Functions
    static async fromURL(url) {
        let file = await fetch(url);
        file = await file.text();
        file = file.split(/\r?\n/);
        let attributes = []; 
        
        let f = [];
        let v = [[0, 0, 0]];
        let vn = [[0, 0, 0]];

        for (let line of file) {
            if (line.startsWith("v ")) {
                let args = line.split(/\s+/);
                v.push([
                    Number(args[1]), 
                    Number(args[2]), 
                    Number(args[3])
                ]);
                continue;
            }

            if (line.startsWith("vn ")) {
                let args = line.split(/\s+/);
                vn.push([
                    Number(args[1]), 
                    Number(args[2]), 
                    Number(args[3])
                ]);
                continue;
            }

            if (line.startsWith("f ")) {
                f.push(line);
                continue;
            }
        }

        for (let face of f) {
            let points = face.split(/\s+/);
            for (let point = 1; point < points.length; point++) {
                let indices = points[point].split('/');

                let position = v[Number(indices[0])];
                attributes.push(position[0]);
                attributes.push(position[1]);
                attributes.push(position[2]);

                let normal = vn[Number(indices[2])];
                attributes.push(normal[0]);
                attributes.push(normal[1]);
                attributes.push(normal[2]);
            }
        }

        return new Mesh(attributes);
    }
}