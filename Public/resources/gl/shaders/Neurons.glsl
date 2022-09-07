#shader vertex
uniform vec2 u_Resolution;

attribute vec4 a_Position;

varying vec2 v_Position;

void main()
{
    v_Position = a_Position.xy;
    v_Position.x *= u_Resolution.x / u_Resolution.y;
    gl_Position = a_Position;
}

#shader fragment
precision highp float;

#include Random
#include SDFs

uniform float u_Time;

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

    vec2 random = Rand22(gridCell) * u_Time;
    vec2 points[9];

    for (int i = 0; i < 9; i++)
    {
        vec2 offset = vec2(-1. + mod(float(i), 3.), -1. + floor(float(i) / 3.));
        points[i] = offset +  sin(Rand22(gridCell + offset) * u_Time) * .25;
    }

    for (int i = 0; i < 9; i++) { color += DrawLine(gridUV, points[4], points[i]); } //4 being the middle point.
    //Draw in the lines that the loop missed, or there'll be gaps where there SHOULD be lines diagonally.
    color += DrawLine(gridUV, points[1], points[3]);
    color += DrawLine(gridUV, points[1], points[5]);
    color += DrawLine(gridUV, points[7], points[3]);
    color += DrawLine(gridUV, points[7], points[5]);

    return color;
}

void main()
{
    vec2 uv = v_Position * .5 + ((sin(u_Time * .5) + 1.) * .25);
    float time = u_Time * .25;
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