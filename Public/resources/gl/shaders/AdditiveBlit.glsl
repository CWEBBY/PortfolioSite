#shader VERTEX_SHADER
attribute vec4 a_Position;

varying vec2 v_Texcoords;

void main()
{
    v_Texcoords = (a_Position.xy * .5) + .5;
    gl_Position = a_Position;
}

#shader FRAGMENT_SHADER
precision highp float;

#include "./resources/gl/includes/Auto.inc"

uniform sampler2D u_MainTex;

varying vec2 v_Texcoords;
                
void main()
{
    gl_FragColor = vec4(u_Time, 0, 1, 1) * texture2D(u_MainTex, v_Texcoords);
}