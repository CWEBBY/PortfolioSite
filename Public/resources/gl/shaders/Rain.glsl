#shader VERTEX_SHADER
uniform vec2 RESOLUTION;

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

varying vec2 v_Position;
uniform float TIME;

float DropsLayer(vec2 UV, float Time, float Size)
{
    vec2 dropAspect = vec2(2., 1.);
    vec2 uv = UV;
    uv *= dropAspect * Size;
    uv.y += TIME * .25;
    vec2 gridCell = floor(uv);
    vec2 gridUV = fract(uv) - .5;
    float cellRandom = Rand21(gridCell);
    float time = TIME + (cellRandom * 6.28); 
    float dropMovement = sin(3.* UV.y * 10.) * pow(sin(UV.y * 10.), 6.) * .4;
    vec2 speed = vec2(abs(((cellRandom - .5) * 2.)) * dropMovement, -sin(time + sin(time + sin(time) * .5)) * .4);
    speed.y += -pow(gridUV.x - speed.x, 2.);
    vec2 dropPosition = (gridUV - speed) / dropAspect;
    float drop = smoothstep(.05, .03, length(dropPosition));
    vec2 trailPosition = (gridUV - vec2(speed.x, time * .25)) / dropAspect;
    trailPosition.y = (fract(trailPosition.y * 8.) - .5) / 8.;
    float trail = smoothstep(.03, .01, length(trailPosition));
    trail *= smoothstep(-.05, .05, dropPosition.y) * smoothstep(.5, speed.y, gridUV.y);
    float color = 0.;
    color += drop;
    color += trail;
    return color;
}

void main()
{
    vec2 uv = v_Position * .5;

    float drops = DropsLayer(uv + 1., TIME, 10.);
    drops += DropsLayer(uv + .75, TIME, 9.);
    drops += DropsLayer(uv + .5, TIME, 8.);
    drops += DropsLayer(uv + .25, TIME, 7.);
    gl_FragColor = vec4(vec3(.75, 0., .15) *  clamp(drops, 0., .2), 1.);
}