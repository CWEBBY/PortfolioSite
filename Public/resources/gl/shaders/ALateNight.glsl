#shader VERTEX_SHADER
#include "./resources/gl/includes/Auto.inc"

attribute vec4 a_Position;
attribute vec2 a_Texcoords;

varying vec2 v_RayDir;

void main()
{
    vec2 normalizedTexcoords = 
        (a_Texcoords - .5) * RESOLUTION;

    v_RayDir = 
        normalizedTexcoords / RESOLUTION.y;

    gl_Position = a_Position;
}

#shader FRAGMENT_SHADER
precision highp float;

#include "./resources/gl/includes/Auto.inc"
#include "./resources/gl/includes/Lighting.inc"
#include "./resources/gl/includes/Raytracing.inc"

varying vec2 v_RayDir;

void main()
{
    vec4 worldPosRayDir = VP * vec4(v_RayDir.x, v_RayDir.y, 0.0, 1.0);


    float sssss = sphere(vec3(0,0,0), 1.0);

    gl_FragColor = vec4(sssss, sssss, sssss, 1.0);
}