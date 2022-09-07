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
uniform vec2 u_Amount;

varying vec2 v_Texcoords;
                
vec4 Blur17 (sampler2D tex, vec2 uv, vec2 blurVector, vec2 texelSize)
{
    vec4 col = vec4(0.);
    vec2 offsetFactor = texelSize * blurVector;
    //
    col += texture2D(tex, uv - 31.4818058 * offsetFactor) * 0.0138234;
    col += texture2D(tex, uv - 29.4829601 * offsetFactor) * 0.0159152;
    col += texture2D(tex, uv - 27.4841145 * offsetFactor) * 0.0181550;
    col += texture2D(tex, uv - 25.4852691 * offsetFactor) * 0.0205196;
    col += texture2D(tex, uv - 23.4864239 * offsetFactor) * 0.0229788;
    col += texture2D(tex, uv - 21.4875788 * offsetFactor) * 0.0254961;
    col += texture2D(tex, uv - 19.4887339 * offsetFactor) * 0.0280290;
    col += texture2D(tex, uv - 17.4898890 * offsetFactor) * 0.0305300;
    col += texture2D(tex, uv - 15.4910443 * offsetFactor) * 0.0329484;
    col += texture2D(tex, uv - 13.4921997 * offsetFactor) * 0.0352313;
    col += texture2D(tex, uv - 11.4933551 * offsetFactor) * 0.0373258;
    col += texture2D(tex, uv - 9.4945107 * offsetFactor) * 0.0391812;
    col += texture2D(tex, uv - 7.4956663 * offsetFactor) * 0.0407505;
    col += texture2D(tex, uv - 5.4968219 * offsetFactor) * 0.0419928;
    col += texture2D(tex, uv - 3.4979775 * offsetFactor) * 0.0428750;
    col += texture2D(tex, uv - 1.4991332 * offsetFactor) * 0.0433731;
                    
    col += texture2D(tex, uv) * 0.0217493;
                    
    col += texture2D(tex, uv + 1.4991332 * offsetFactor) * 0.0433731;
    col += texture2D(tex, uv + 3.4979775 * offsetFactor) * 0.0428750;
    col += texture2D(tex, uv + 5.4968219 * offsetFactor) * 0.0419928;
    col += texture2D(tex, uv + 7.4956663 * offsetFactor) * 0.0407505;
    col += texture2D(tex, uv + 9.4945107 * offsetFactor) * 0.0391812;
    col += texture2D(tex, uv + 11.4933551 * offsetFactor) * 0.0373258;
    col += texture2D(tex, uv + 13.4921997 * offsetFactor) * 0.0352313;
    col += texture2D(tex, uv + 15.4910443 * offsetFactor) * 0.0329484;
    col += texture2D(tex, uv + 17.4898890 * offsetFactor) * 0.0305300;
    col += texture2D(tex, uv + 19.4887339 * offsetFactor) * 0.0280290;
    col += texture2D(tex, uv + 21.4875788 * offsetFactor) * 0.0254961;
    col += texture2D(tex, uv + 23.4864239 * offsetFactor) * 0.0229788;
    col += texture2D(tex, uv + 25.4852691 * offsetFactor) * 0.0205196;
    col += texture2D(tex, uv + 27.4841145 * offsetFactor) * 0.0181550;
    col += texture2D(tex, uv + 29.4829601 * offsetFactor) * 0.0159152;
    col += texture2D(tex, uv + 31.4818058 * offsetFactor) * 0.0138234;
    //
                    
    return col;
}
                
void main()
{
    vec2 texelDimensions = vec2(1./u_Resolution.x, 1./u_Resolution.y);
    gl_FragColor = Blur17(u_MainTex, v_Texcoords, u_Amount, texelDimensions);
}