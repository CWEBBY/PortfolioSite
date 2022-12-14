#shader vertex
attribute vec4 a_Position;

varying vec2 v_Texcoords;

void main()
{
    v_Texcoords = (a_Position.xy * .5) + .5;
    gl_Position = a_Position;
}

#shader fragment
precision highp float;

uniform sampler2D u_MainTex;
uniform float u_Strength;

#include Auto

varying vec2 v_Texcoords;
                
void main()
{
    vec2 srfTexl = 1. / u_Resolution;
    float reducemul = 1.0 / 8.0;
    float reducemin = 1.0 / 128.0;
                    
    vec3 basecol = texture2D(u_MainTex, v_Texcoords).rgb;
    vec3 baseNW = texture2D(u_MainTex, v_Texcoords - srfTexl).rgb;
    vec3 baseNE = texture2D(u_MainTex, v_Texcoords + vec2(srfTexl.x, -srfTexl.y)).rgb;
    vec3 baseSW = texture2D(u_MainTex, v_Texcoords + vec2(-srfTexl.x, srfTexl.y)).rgb;
    vec3 baseSE = texture2D(u_MainTex, v_Texcoords + srfTexl).rgb;
                    
    vec3 gray = vec3(0.299, 0.587, 0.114);
    float monocol = dot(basecol, gray);
    float monoNW = dot(baseNW, gray);
    float monoNE = dot(baseNE, gray);
    float monoSW = dot(baseSW, gray);
    float monoSE = dot(baseSE, gray);
                    
    float monomin = min(monocol, min(min(monoNW, monoNE), min(monoSW, monoSE)));
    float monomax = max(monocol, max(max(monoNW, monoNE), max(monoSW, monoSE)));
                    
    vec2 dir = vec2(-((monoNW + monoNE) - (monoSW + monoSE)), ((monoNW + monoSW) - (monoNE + monoSE)));
    float dirreduce = max((monoNW + monoNE + monoSW + monoSE) * reducemul * 0.25, reducemin);
    float dirmin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirreduce);
    dir = min(vec2(u_Strength), max(vec2(-u_Strength), dir * dirmin)) * srfTexl;
                    
    vec4 resultA = 0.5 * (texture2D(u_MainTex, v_Texcoords + dir * -0.166667) + texture2D(u_MainTex, v_Texcoords + dir * 0.166667));
    vec4 resultB = resultA * 0.5 + 0.25 * (texture2D(u_MainTex, v_Texcoords + dir * -0.5) + texture2D(u_MainTex, v_Texcoords + dir * 0.5));
                    
    float monoB = dot(resultB.rgb, gray);
                    
    if(monoB < monomin || monoB > monomax) { gl_FragColor = resultA; }
    else { gl_FragColor = resultB; }
}