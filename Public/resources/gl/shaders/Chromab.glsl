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
uniform vec2 u_Resolution;
uniform float u_Offset;

varying vec2 v_Texcoords;

void main()
{
    float radialOffset = length(((v_Texcoords - .5) * u_Resolution) / u_Resolution.y);
                    
    vec3 color = texture2D(u_MainTex, v_Texcoords).rgb;
                    
    vec3 abberation;
    abberation.r = texture2D(u_MainTex, v_Texcoords - vec2(u_Offset)).r;
    abberation.g = color.g;
    abberation.b = texture2D(u_MainTex, v_Texcoords + vec2(u_Offset)).b;
                    
    color = mix(color, abberation, radialOffset);
                    
    gl_FragColor = vec4(color.rgb, 1.);
}