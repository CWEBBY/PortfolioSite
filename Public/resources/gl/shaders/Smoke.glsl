#shader VERTEX_SHADER

#include "./resources/gl/includes/Auto.inc"

attribute vec4 a_Position;

varying vec2 v_Position;

void main()
{
    v_Position = a_Position.xy;
    v_Position.x *= RESOLUTION.x / RESOLUTION.y;
    gl_Position = a_Position;
}

#shader FRAGMENT_SHADER
precision highp float;

#include "./resources/gl/includes/Random.inc"
#include "./resources/gl/includes/Auto.inc"

varying vec2 v_Position;

float SmoothNoiseLayer(vec2 uv)
{
    float nCol = 0.;

    nCol += SmoothRand21(uv*4.);
    nCol += SmoothRand21(uv*8.) * .5;
    nCol += SmoothRand21(uv*16.) * .25;
    nCol += SmoothRand21(uv*32.) * .125;
    nCol += SmoothRand21(uv*64.) * .0625;
    nCol += SmoothRand21(uv*128.) * .03125;
    nCol += SmoothRand21(uv*256.) * .0015125;
    nCol /= 2.;

    return nCol;
}

void main()
{
    vec2 uv = v_Position;
    vec2 speed = TIME * vec2(-.06125,.025);
    float noise1 = SmoothNoiseLayer(uv + speed);
    float noise2 = SmoothNoiseLayer(uv * vec2(1., 1.) + speed * vec2(-1.123486, 2.18413212));
    float noise3 = SmoothNoiseLayer(uv * vec2(1., 1.) + speed * vec2(2.231156, -1.913483));

    float col = 1. * (noise1 * (noise1 * noise3));
    gl_FragColor = vec4(vec3(.75, 0., .15) *  clamp(col, 0., .2), 1.);
}