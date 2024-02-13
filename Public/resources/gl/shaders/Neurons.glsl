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
#include "./resources/gl/includes/SDFs.inc"

uniform float TIME;

varying vec2 v_Position;

float DrawLine(vec2 position, vec2 pointA, vec2 pointB)
{
    float dist = sdfPole(position, pointA, pointB);
    return smoothstep(.02, .0, dist);
}

float LayerOfLines(vec2 UV)
{
    float color = 0.;
    vec2 gridCell = floor(UV);
    vec2 gridUV = fract(UV) - .5;

    vec2 random = Rand22(gridCell) * TIME;
    vec2 points[9];

    for (int i = 0; i < 9; i++)
    {
        vec2 offset = vec2(-1. + mod(float(i), 3.), -1. + floor(float(i) / 3.));
        points[i] = offset +  sin(Rand22(gridCell + offset) * TIME) * .25;
    }

    for (int i = 0; i < 9; i++) { color += DrawLine(gridUV, points[4], points[i]); }
    color += DrawLine(gridUV, points[1], points[3]);
    color += DrawLine(gridUV, points[1], points[5]);
    color += DrawLine(gridUV, points[7], points[3]);
    color += DrawLine(gridUV, points[7], points[5]);

    return color;
}

void main()
{
    vec2 uv = v_Position * .5 + ((sin(TIME * .5) + 1.) * .25);
    float time = TIME * .25;
    float color = 0.;

    mat2 viewMat = mat2(
        vec2(-cos(time), sin(time)),
        vec2(sin(time), cos(time))
    );

    uv *= viewMat;

    for (float i = 0.; i <= 1.; i += 1./4.)
    {
        float depth = fract(i + time * .125);
        float fade = smoothstep(0., 1., depth) * smoothstep(1., .0, depth);
        color += LayerOfLines(uv * (mix(25., 0., depth) * .6) + (i * 3.14)) * fade;
    }
    gl_FragColor = vec4(vec3(.75, 0., .15) *  clamp(color, 0., .2), 1.);
}