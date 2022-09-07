#shader vertex

#include Auto

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
#include Auto

varying vec2 v_Position;

float LayerOfNoise(vec2 uv)
{
    vec2 gridCelId = floor(uv);
    vec2 gridCellUV = fract(uv);
    vec4 gridCell;
    gridCell.x = Rand21(gridCelId + vec2(0., 0.));
    gridCell.y = Rand21(gridCelId + vec2(1., 0.));
    gridCell.z = Rand21(gridCelId + vec2(0., 1.));
    gridCell.w = Rand21(gridCelId + vec2(1., 1.));
    vec2 tb;
    tb.x = mix(gridCell.x, gridCell.y, gridCellUV.x);
    tb.y = mix(gridCell.z, gridCell.w, gridCellUV.x);
    return smoothstep(.25,.75, mix(tb.x, tb.y, gridCellUV.y));
}

void main()
{
    vec2 fireSpeed = vec2(0., -1.);
    vec2 uv = (v_Position * .5) + .25;
    vec2 noiseUV = uv + fireSpeed * (u_Time + 5.); //+5 to skip a bad bit in the time generated noise, there's a pattern at t=0, takes 5 seconds to randomize.
    vec2 specialFX = vec2(LayerOfNoise(noiseUV * 64.), ((LayerOfNoise(noiseUV * 2.) - .5) * 2.) * .01);
    noiseUV.x += specialFX.y;
    float cell = 0.;
    float count = 0.;
    for (float i = 1.; i < 32.; i++)
    {
        cell += LayerOfNoise(noiseUV * (2. * i)) / i;
        count += 1. / i;
    }
    cell /= count;
    float flame = smoothstep(.0, .25, cell*1.-uv.y);
    flame *= cell * 4.;  //I'd like to say 4 is because I quartered it on the above line, but it's just a sweetspot number.
    flame -= step(specialFX.x, .1) * .8 * flame;
    gl_FragColor = vec4(vec3(.75, 0., .15) *  clamp(flame, 0., .2), 1.);
}