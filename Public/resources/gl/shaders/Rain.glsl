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

varying vec2 v_Position;
uniform float u_Time;

float DropsLayer(vec2 UV, float Time, float Size)
{
    vec2 dropAspect = vec2(2., 1.);
    vec2 uv = UV;
    uv *= dropAspect * Size;
    uv.y += u_Time * .25;
    vec2 gridCell = floor(uv);
    vec2 gridUV = fract(uv) - .5;
    float cellRandom = Rand21(gridCell);
    float time = u_Time + (cellRandom * 6.28); //2 * pi
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

    float drops = DropsLayer(uv + 1., u_Time, 10.);
    drops += DropsLayer(uv + .75, u_Time, 9.);
    drops += DropsLayer(uv + .5, u_Time, 8.);
    drops += DropsLayer(uv + .25, u_Time, 7.);
    gl_FragColor = vec4(vec3(.75, 0., .15) *  clamp(drops, 0., .2), 1.);
}