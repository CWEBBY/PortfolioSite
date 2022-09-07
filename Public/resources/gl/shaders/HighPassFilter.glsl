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
uniform float u_Threshold;
uniform float u_Range;

varying vec2 v_Texcoords;

                
void main()
{
    vec4 col = texture2D(u_MainTex, v_Texcoords);

    float luminance = dot(col.rgb, vec3(0.229,0.587,0.114));

    float weight = smoothstep(u_Threshold, u_Threshold + u_Range, luminance);

    col.rgb = mix(vec3(0.0), col.rgb, weight);

    gl_FragColor = col;
}