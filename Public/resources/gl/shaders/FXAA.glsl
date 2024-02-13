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

varying vec2 v_Texcoords;
                
void main()
{
    gl_FragColor = vec4(0, 0, 1, 1);
}