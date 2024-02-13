#shader VERTEX_SHADER

#include "./resources/gl/includes/Auto.inc"

attribute vec4 a_Position;
attribute vec2 a_Texcoords;

varying vec2 v_Position;

void main()
{
    gl_Position = a_Position;
    v_Position = a_Texcoords.xy - .5;
    v_Position.x *= RESOLUTION.x / RESOLUTION.y;
}

#shader FRAGMENT_SHADER
precision highp float;

#include "./resources/gl/includes/Auto.inc"

uniform float u_Size;

varying vec2 v_Position;

float Hex(vec2 pos) { return max(dot(abs(pos), normalize(vec2(1.73,1.))), abs(pos).y); }

void main()
{
    vec2 uv = v_Position;
    vec2 speed = TIME * vec2(.0);
    uv *= max(u_Size, 5.);
    vec2 hexAspect = vec2(1.732, 1.);
    vec2 gridA = mod(uv, hexAspect) - (hexAspect* .5);
    vec2 gridB = mod(uv - (hexAspect* .5), hexAspect) - (hexAspect* .5); 
    vec2 grid = abs(mix(gridA, gridB, step(length(gridB), length(gridA))));
    float h = smoothstep(.4, .5,  Hex(grid));
    uv /=  1. - ((sin(TIME) + 1.) * .5) * .1;
    gridA = mod(uv, hexAspect) - (hexAspect* .5);
    gridB = mod(uv - (hexAspect* .5), hexAspect) - (hexAspect* .5);
    grid = abs(mix(gridA, gridB, step(length(gridB), length(gridA))));
    h+= smoothstep(mix(.4, .45, (sin(TIME) + 1.) * .5), .5,  Hex(grid)) * 1. - ((sin(TIME) + 1.) * .25);
    gl_FragColor = vec4(vec3(.75, 0., .15) *  clamp(h, 0., .2), 1.);
}