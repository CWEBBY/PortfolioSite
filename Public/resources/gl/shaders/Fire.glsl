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

float LayerOfNoise(vec2 uv)
{
    vec2 gridCelId = floor(uv);
    vec2 gridCellUV = fract(uv);
    vec4 gridCell;
    gridCell.x = SmoothRand21(gridCelId + vec2(0., 0.));
    gridCell.y = SmoothRand21(gridCelId + vec2(1., 0.));
    gridCell.z = SmoothRand21(gridCelId + vec2(0., 1.));
    gridCell.w = SmoothRand21(gridCelId + vec2(1., 1.));
    vec2 tb;
    tb.x = mix(gridCell.x, gridCell.y, gridCellUV.x);
    tb.y = mix(gridCell.z, gridCell.w, gridCellUV.x);
    return smoothstep(.25,.75, mix(tb.x, tb.y, gridCellUV.y));
}

float LayersOfNoise(vec2 uv, float iterations)
{
    float cell = 0.;
    float count = 0.;

    for (float i = 1.; i < 64.; i++)
    {
        cell += SmoothRand21(uv * i) / i;
        count += 1. / i;

        if (i > iterations) { break; }
    }

    return cell / count;
}

void main()
{
    vec2 fireSpeed = vec2(0., -1.);
    vec2 uv = (v_Position * .5) + .25 + 10.;
    
    float noise = LayersOfNoise(uv + vec2(0, -TIME * .5), 16.);
    float offs = ((noise - .5) * 2.) * .25;

    noise = LayersOfNoise(uv + offs + vec2(0, -TIME * 1.), 16.);
    float gradientNoise = noise * (-v_Position.y + .5);
    gradientNoise = smoothstep(.5, .75, gradientNoise);

    gl_FragColor = vec4(vec3(.75, 0., .15) *  clamp(gradientNoise, 0., .2), 1.);
}