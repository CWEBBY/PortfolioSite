/*==================================================
WebGLResources.js
cwebb, 08/09/2019.
A file containing shaders for WebGL implementation
  on 'Base.js', externalized for easy swappping.
==================================================*/
//This function is what builds the shader  objects used by Base.js, externalized to make it easier to swap shader files if need be.
var logoShader, utilityShaders;

function GetShader()
{
  logoShader = {"name": "Noise", "program" : null, "source" : {"vertex" : basicVertexShaderSource, "fragment" : frostFragmentShaderSource}, "setup": frostSetup, "update": frostUpdate};
  utilityShaders = [
    {"name": "GBlur", "program" : null, "source" : {"vertex" : basicVertexShaderSource, "fragment" : gBlurFragmentShaderSource}, "setup": gBlurSetup, "update": null},                          //0
    {"name": "Blit", "program" : null, "source" : {"vertex" : basicVertexShaderSource, "fragment" : blitFragmentShaderSource}, "setup": blitSetup, "update": null} ,
	];
}

function frostSetup(glObject)
{
  glObject.context.enable(glObject.context.BLEND);
  glObject.context.blendFunc(glObject.context.ONE, glObject.context.ONE_MINUS_SRC_ALPHA);
  ResizeGLCanvas(glObject);
  glObject.shader.program = CompileShader(glObject.context, glObject.shader.source.vertex, glObject.shader.source.fragment);
  SetGLCanvasShader(glObject, glObject.shader.program);
  glObject.buffers.position = CreateGLBuffer(glObject, [-1,-1,-1,1,1,-1,1,1,-1,1,1,-1]);
  glObject.buffers.texCoord = CreateGLBuffer(glObject, [0,0,0,1,1,0,1,1,0,1,1,0]);
  glObject.shader.utility = {
    "gblur": {},
    "blit": {},
    "renderTextures": {},
    "renderBuffers" : {}
  }
  glObject.shader.utility.renderTextures.renderTexture1 = CreateRenderTexture(glObject.context, glObject.canvas.width, glObject.canvas.height);
  glObject.shader.utility.renderTextures.renderTexture2 = CreateRenderTexture(glObject.context,  glObject.canvas.width, glObject.canvas.height);
  glObject.shader.utility.renderBuffers.renderBuffer1 = CreateRenderBuffer(glObject, glObject.shader.utility.renderTextures.renderTexture1);
  glObject.shader.utility.renderBuffers.renderBuffer2 = CreateRenderBuffer(glObject, glObject.shader.utility.renderTextures.renderTexture2);

  glObject.shader.utility.gblur = utilityShaders[0];
  glObject.shader.utility.gblur.program = CompileShader(glObject.context, glObject.shader.utility.gblur.source.vertex, glObject.shader.utility.gblur.source.fragment);
  glObject.shader.utility.gblur.setup(glObject);

  glObject.shader.utility.blit = utilityShaders[1];
  glObject.shader.utility.blit.program = CompileShader(glObject.context, glObject.shader.utility.blit.source.vertex, glObject.shader.utility.blit.source.fragment);
  glObject.shader.utility.blit.setup(glObject);
}

function frostUpdate(glObject)
{
  //Update
  RTResize(glObject);
  ResizeGLCanvas(glObject);
  glObject.context.blendFunc(glObject.context.ONE, glObject.context.ONE_MINUS_SRC_ALPHA);
  //Render
  //First Pass
  SetRenderTarget(glObject, glObject.shader.utility.renderBuffers.renderBuffer1);
  ClearGLCanvas(glObject);
  SetGLCanvasShader(glObject, glObject.shader.utility.blit.program);
  SetGLAttribute(glObject, glObject.shader.utility.blit.program, "a_position", glObject.buffers.position, 2);
  SetGLAttribute(glObject, glObject.shader.utility.blit.program, "a_texCoord", glObject.buffers.texCoord, 2);
  SetGLUniformFloat(glObject, glObject.shader.utility.blit.program, "u_time", page.time.time);
  SetGLUniformVec2(glObject, glObject.shader.utility.blit.program, "u_res", glObject.canvas.clientWidth, glObject.canvas.clientHeight);
  UploadTexturesToShader(glObject, glObject.shader.utility.blit.program, page.banner.gl.textures.sources);//[glObject.shader.utility.renderTextures.renderTexture1]);
  DrawGLCanvas(glObject);

  //Blur
  var blurSteps = 2;
  for (var blurStep = 0; blurStep < blurSteps; blurStep++)
  {
    SetRenderTarget(glObject, glObject.shader.utility.renderBuffers.renderBuffer2);
    ClearGLCanvas(glObject);
    SetGLCanvasShader(glObject, glObject.shader.utility.gblur.program);
    SetGLAttribute(glObject, glObject.shader.utility.gblur.program, "a_position", glObject.buffers.position, 2);
    SetGLAttribute(glObject, glObject.shader.utility.gblur.program, "a_texCoord", glObject.buffers.texCoord, 2);
    SetGLUniformFloat(glObject, glObject.shader.utility.gblur.program, "u_time", page.time.time);
    SetGLUniformVec2(glObject, glObject.shader.utility.gblur.program, "u_res", glObject.canvas.clientWidth, glObject.canvas.clientHeight);
    SetGLUniformVec2(glObject, glObject.shader.utility.gblur.program, "u_blurAmount", 0.,.1);
    UploadTexturesToShader(glObject, glObject.shader.utility.gblur.program, [glObject.shader.utility.renderTextures.renderTexture1]);
    DrawGLCanvas(glObject);

    SetRenderTarget(glObject, glObject.shader.utility.renderBuffers.renderBuffer1);
    ClearGLCanvas(glObject);
    SetGLCanvasShader(glObject, glObject.shader.utility.gblur.program);
    SetGLAttribute(glObject, glObject.shader.utility.gblur.program, "a_position", glObject.buffers.position, 2);
    SetGLAttribute(glObject, glObject.shader.utility.gblur.program, "a_texCoord", glObject.buffers.texCoord, 2);
    SetGLUniformFloat(glObject, glObject.shader.utility.gblur.program, "u_time", page.time.time);
    SetGLUniformVec2(glObject, glObject.shader.utility.gblur.program, "u_res", glObject.canvas.clientWidth, glObject.canvas.clientHeight);
    SetGLUniformVec2(glObject, glObject.shader.utility.gblur.program, "u_blurAmount", 0.1,0.);
    UploadTexturesToShader(glObject, glObject.shader.utility.gblur.program, [glObject.shader.utility.renderTextures.renderTexture2]);
    DrawGLCanvas(glObject);
  }

  //Blit to canvas
  glObject.context.blendFunc(glObject.context.SRC_ALPHA, glObject.context.ONE_MINUS_SRC_ALPHA);
  SetRenderTarget(glObject, null);
  ClearGLCanvas(glObject);
  SetGLCanvasShader(glObject, glObject.shader.program);
  SetGLAttribute(glObject, glObject.shader.program, "a_position", glObject.buffers.position, 2);
  SetGLAttribute(glObject, glObject.shader.program, "a_texCoord", glObject.buffers.texCoord, 2);
  SetGLUniformFloat(glObject, glObject.shader.program, "u_time", page.time.time);
  SetGLUniformVec2(glObject, glObject.shader.program, "u_res", glObject.canvas.clientWidth, glObject.canvas.clientHeight);
  UploadTexturesToShader(glObject, glObject.shader.program, [glObject.shader.utility.renderTextures.renderTexture1, page.banner.gl.textures.sources[0], page.banner.gl.textures.sources[1]]);
  DrawGLCanvas(glObject);

}

function gBlurSetup(glObject)
{
  glObject.shader.utility.gblur.buffers = {};
  glObject.shader.utility.gblur.buffers.position = CreateGLBuffer(glObject, [-1,-1,-1,1,1,-1,1,1,-1,1,1,-1]);
  glObject.shader.utility.gblur.buffers.texCoord = CreateGLBuffer(glObject, [0,0,0,1,1,0,1,1,0,1,1,0]);
}

function blitSetup(glObject)
{
  glObject.shader.utility.blit.buffers = {};
  glObject.shader.utility.blit.buffers.position = CreateGLBuffer(glObject, [-1,-1,-1,1,1,-1,1,1,-1,1,1,-1]);
  glObject.shader.utility.blit.buffers.texCoord = CreateGLBuffer(glObject, [0,0,0,1,1,0,1,1,0,1,1,0]);
}

function RTResize(glObject)
{
  if ((glObject.size.width != glObject.canvas.width) || (glObject.size.height != glObject.canvas.height))
  {
    //Do resizing here
    glObject.context.deleteTexture(glObject.shader.utility.renderTextures.renderTexture1);
    glObject.context.deleteFramebuffer(glObject.shader.utility.renderBuffers.renderBuffer1);
    glObject.shader.utility.renderTextures.renderTexture1 = CreateRenderTexture(glObject.context,  glObject.canvas.width / glObject.size.scaler, glObject.canvas.height / glObject.size.scaler);
    glObject.shader.utility.renderBuffers.renderBuffer1 = CreateRenderBuffer(glObject, glObject.shader.utility.renderTextures.renderTexture1);

    glObject.context.deleteTexture(glObject.shader.utility.renderTextures.renderTexture2);
    glObject.context.deleteFramebuffer(glObject.shader.utility.renderBuffers.renderBuffer2);
    glObject.shader.utility.renderTextures.renderTexture2 = CreateRenderTexture(glObject.context,  glObject.canvas.width / glObject.size.scaler, glObject.canvas.height / glObject.size.scaler);
    glObject.shader.utility.renderBuffers.renderBuffer2 = CreateRenderBuffer(glObject, glObject.shader.utility.renderTextures.renderTexture2);
    //
    glObject.size.width = glObject.canvas.width;
    glObject.size.height = glObject.canvas.height;
  }
}

//Basic Vert, nothing more than a UV pass in, used for most/all cases.
var basicVertexShaderSource = `
  attribute vec4 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_uv;

  void main()
  {
    gl_Position = a_position;
    v_uv = a_texCoord;
  }
`;

//Utilities
var gBlurFragmentShaderSource = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time;
uniform sampler2D u_tex0;
uniform vec2 u_blurAmount;

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
  vec2 uv = v_uv;
  vec2 texelDimensions = vec2(1./u_res.x, 1./u_res.y);
  vec4 fragSample = Blur17(u_tex0, v_uv, u_blurAmount, texelDimensions);
  gl_FragColor = fragSample;
}
`;

var blitFragmentShaderSource = `
  precision highp float;
  varying vec2 v_uv;
  uniform vec2 u_res;
  uniform float u_time;
  uniform sampler2D u_tex0;

  void main()
  {
    vec2 uv = vec2(v_uv.x,1.-v_uv.y);
    gl_FragColor = texture2D(u_tex0, uv);
  }
`;

var frostFragmentShaderSource = `
  precision highp float;
  varying vec2 v_uv;
  uniform vec2 u_res;
  uniform float u_time;
  uniform sampler2D u_tex0;
  uniform sampler2D u_tex1;
  uniform sampler2D u_tex2;

  void main()
  {
    vec2 uv = v_uv;
    vec4 noise1 = vec4(3.,.75,-0.098491,.05);
    vec4 noise2 = vec4(2.,.5,.0168460,-.05);
    vec4 noise3 = vec4(4.,1.,-.0546846,.05);
    float colorBoost = 10.;

    float frostCol = 1.;
    float frostAlpha =
      texture2D(u_tex2, (uv*noise1.rg) + (noise1.ba*u_time)).r *
      texture2D(u_tex2, (uv*noise2.rg) + (noise2.ba*u_time)).g *
      texture2D(u_tex2, (uv*noise3.rg) + (noise3.ba*u_time)).b *
      texture2D(u_tex0, uv).a *
      colorBoost
    ;
    vec4 frost = vec4(vec3(frostCol), frostAlpha);

    vec4 logo = texture2D(u_tex1, vec2(uv.x, 1.-uv.y));

    vec4 finalCol = mix(frost, logo, logo.a);
    //gl_FragColor = frost;
    gl_FragColor = finalCol;
  }
`;
