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
uniform sampler2D u_AddTex;

varying vec2 v_Texcoords;

void main()
{
    gl_FragColor = texture2D(u_MainTex, v_Texcoords) + texture2D(u_AddTex, v_Texcoords);
}