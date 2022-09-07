/*==================================================
Base.js
cwebb, 08/09/2019.
A file containing most functions the website depends on.
==================================================*/
window.onload = function() {Awake();}
var slideIndex = 1;
var slideTimer = 0;
var slideDuration = 2.5;
var page =
{
  "fps" : 60,
  "loaded" : false,

  "time" : {
    "first" : null,
    "current" : 0,
    "delta" : 0,
    "time" : 0,
    "last" : 0,
    "loadin" : null
  },

  "scroller" : {
    "sections" : {
      "about":0,
      "residential":1,
      "commercial":2,
      "services":3,
			"contact":4
    },

    "positions" : {
      "about" : {
        "navlink" : null,
        "section" : null,
        "y" : null,
        "h" : null
      },
      "residential" : {
        "navlink" : null,
        "section" : null,
        "y" : null,
        "h" : null
      },
      "commercial" : {
        "navlink" : null,
        "section" : null,
        "y" : null,
        "h" : null
      },
			"services" : {
        "navlink" : null,
        "section" : null,
        "y" : null,
        "h" : null
      },
			"contact" : {
        "navlink" : null,
        "section" : null,
        "y" : null,
        "h" : null
      }
    },

    "timer" :{
      "time":0,
      "duration":.5,
    },

    "position" :{
      "start" : 0,
      "end" : 0
    },

    "section" : 0,
    "locked" : true
  },

  "banner" : {
    "gl" : {
      "enabled" : true,
      "object" : {
        "canvas" : null,
        "context" : null,
        "size" : {
          "scaler" : 1,
          "width" : 0,
          "height" : 0
        },
        "shader" : {
          "program" : null,
          "source" : {
            "vertex" : null,
            "fragment" : null
          },
          "setup" : null,
          "update" : null
        },
        "uniforms" : null,
        "buffers" : {
          "position" : "",
          "texCoord" : ""
        }
      },
      "textures" : {
        "loaded" : false,
        "texturespecs" : [        //This is clunky but it is the Webgl texture specs for each of the textures below in order of index.
          ["bilinear", "wrap"],   //bilinear or anthing else for nearest, wrap for repeat or anything else for clamp
          ["bilinear", "wrap"]
        ],
        "sources" : [
          "./Images+Videos/AnythingAirLogo.png",
          "./Images+Videos/NoiseTex.png",
        ]
      }
    }
  },

  "mobile" : {
    "landscape" : false,
    "menuopen" : false
  }
};

//Loop
function Awake()
{
  Start();
  requestAnimationFrame(Timer);
}

function Start()
{
  GetBanner();
  GetShader();
  GetWebGLImages();
}

function AsyncStart()
{
  var isLoaded = page.banner.gl.textures.loaded;

  if (isLoaded)
  {
    if (page.time.loadin == null) {page.time.loadin = page.time.time;}
    page.loaded = true;
  }
}

function Update()
{
  OrientationController();
  BannerController();
  NavigationBarController();
  ScrollerController();
  ShowSlides(slideIndex);
  if (slideTimer < slideDuration) {slideTimer+=page.time.delta;}
  else {IncrementSlideIndex(1);}
}

//Menu / Navigation / AutoScroller / Orientation
function NavigationBarController()
{
  page.scroller.positions.about = 			{"navlink" : document.getElementById("AboutLink"), "section" : document.getElementById("About"), "y" : document.getElementById("About").getBoundingClientRect().y, "h" : document.getElementById("About").getBoundingClientRect().height};
  page.scroller.positions.residential = {"navlink" : document.getElementById("ResidentialLink"), "section" : document.getElementById("Residential"), "y" : document.getElementById("Residential").getBoundingClientRect().y, "h" : document.getElementById("Residential").getBoundingClientRect().height};
  page.scroller.positions.commercial = {"navlink" : document.getElementById("CommercialLink"), "section" : document.getElementById("Commercial"), "y" : document.getElementById("Commercial").getBoundingClientRect().y, "h" : document.getElementById("Commercial").getBoundingClientRect().height};
  page.scroller.positions.services = {"navlink" : document.getElementById("ServicesLink"), "section" : document.getElementById("Services"), "y" : document.getElementById("Services").getBoundingClientRect().y, "h" : document.getElementById("Services").getBoundingClientRect().height};
	page.scroller.positions.contact = {"navlink" : document.getElementById("ContactLink"), "section" : document.getElementById("Contact"), "y" : document.getElementById("Contact").getBoundingClientRect().y, "h" : document.getElementById("Contact").getBoundingClientRect().height};
}

function GoToSection(section)
{
  if (page.scroller.locked)
  {
    page.scroller.section = section;
    page.scroller.position.start = window.pageYOffset;
    page.scroller.locked = false;
    if(page.mobile.landscape) {SetPhoneMenu(true);}
  }
}

function SetPhoneMenu(isOpen)
{
  page.mobile.menuopen = !isOpen;
}

function ScrollerController()
{
  if (!page.scroller.locked)
  {
    var navigationBarOffset;
    var edgeScrollFix = null;
    if (page.mobile.landscape) {navigationBarOffset = 0;} //The non sticky bar offset.
    else {navigationBarOffset = 48;} //The sticky bar offset.
    switch (page.scroller.section) {
      case page.scroller.sections.about:
        edgeScrollFix = "#Home";
        page.scroller.position.end = window.pageYOffset + page.scroller.positions.about.y - 100;
        break;
      case page.scroller.sections.residential:
        edgeScrollFix = "#AboutMe";
        page.scroller.position.end = window.pageYOffset + page.scroller.positions.residential.y - navigationBarOffset +5;
        break;
      case page.scroller.sections.commercial:
        edgeScrollFix = "#Portfolio";
        page.scroller.position.end = window.pageYOffset + page.scroller.positions.commercial.y - navigationBarOffset +5;
        break;
      case page.scroller.sections.services:
        edgeScrollFix = "#Contact";
        page.scroller.position.end = window.pageYOffset + page.scroller.positions.services.y - navigationBarOffset +5;
        break;
			case page.scroller.sections.contact:
        edgeScrollFix = "#Contact";
        page.scroller.position.end = window.pageYOffset + page.scroller.positions.contact.y - navigationBarOffset +5;
        break;
    }
    if (/Edge/.test(navigator.userAgent)) {
      if (edgeScrollFix != null)
      {
        location.href = edgeScrollFix;
        page.scroller.locked = true;
        page.scroller.timer.time = 0;
      }
      else {return;}
    }
    else
    {
      if(page.scroller.timer.time < page.scroller.timer.duration)
      {
        var t = page.scroller.timer.time / page.scroller.timer.duration;
         t = t*t*t * (t * (6*t - 15) + 10);
        window.scroll(0,Lerp(page.scroller.position.start, page.scroller.position.end,t));
        page.scroller.timer.time += page.time.delta;
      }
      else
      {
          window.scroll(0,page.scroller.position.end);
          page.scroller.timer.time = 0;
          page.scroller.locked = true;
      }
    }
  }
}

function OrientationController()
{
  page.mobile.landscape = window.innerWidth <= 920;

	if (page.mobile.landscape)
	{
		document.getElementById("Burger").style.display="block";
		if (page.mobile.menuopen) {document.getElementById("NavigationMenu").style.display="block";}
		else {document.getElementById("NavigationMenu").style.display="none";}
	}
	else
	{
		document.getElementById("NavigationMenu").style.display="block";
		document.getElementById("Burger").style.display="none";
	}
}

//Banner
function GetBanner()
{
	if (page.banner.gl.enabled)
	{
		page.banner.gl.object.canvas = document.getElementById("NavigationBarLogoWebGL");
		page.banner.gl.object.context = page.banner.gl.object.canvas.getContext("webgl");
	}

  if (page.banner.gl.object.context == null)
  {
    console.log("Your browser does not seem to work with WebGL, this doesn't matter but keep in mind that elements of the page may not work as intended as a result.");
    page.banner.gl.enabled = false;
		document.getElementById("NavigationBarLogoImage").style.display="block";
		document.getElementById("NavigationBarLogoWebGL").style.display="none";
  }
	else
	{
		document.getElementById("NavigationBarLogoImage").style.display="none";
		document.getElementById("NavigationBarLogoWebGL").style.display="block";
	}
}

function BannerController()
{
	var eleLogo=null,
			eleNavigationBar=document.getElementById("NavigationBar"),
			iWidth=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;;
		if (page.banner.gl.enabled) {eleLogo=document.getElementById("NavigationBarLogoWebGL");}
		else {eleLogo=document.getElementById("NavigationBarLogoImage")}
		if (!page.mobile.landscape) {
			if (eleNavigationBar.getBoundingClientRect().bottom>90) {
				eleLogo.height=100;
				eleLogo.width=eleLogo.height*4.4;
			}
			else if (eleNavigationBar.getBoundingClientRect().top<0) {
				eleLogo.height=0+eleNavigationBar.getBoundingClientRect().bottom;
				eleLogo.width=eleLogo.height*4.4;
			}
		}
		else {
			eleLogo.clientWidth=iWidth;
			eleLogo.clientHeight=iWidth/8;
			eleLogo.width=iWidth;
			eleLogo.height=iWidth/4;
		}

  if (page.banner.gl.enabled) {BannerRender();}
}

function BannerSetup()
{
  GetBanner();
  page.banner.gl.object.shader = logoShader;
	page.banner.gl.object.shader.setup(page.banner.gl.object);
}

function BannerRender()
{
  if (page.banner.gl.object.shader.program != null)
  {
    page.banner.gl.object.size.scaler = 1;
    ResizeGLCanvas(page.banner.gl.object);
    page.banner.gl.object.shader.update(page.banner.gl.object);
  }
  else {BannerSetup();}
}

//WebGL Helpers
function CompileShader(context, vertSource, fragSource)
{
  var program = null;
  function CreateShader(context, type, source) {
    var shader = context.createShader(type);
    context.shaderSource(shader, source);
    context.compileShader(shader);
    var success = context.getShaderParameter(shader, context.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(context.getShaderInfoLog(shader));
    context.deleteShader(shader);
  }

  function CreateProgram(context, vertexShader, fragmentShader) {
    var program = context.createProgram();
    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);
    context.linkProgram(program);
    var success = context.getProgramParameter(program, context.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(context.getProgramInfoLog(program));
    context.deleteProgram(program);
  }

  var vertexShader = CreateShader(context, context.VERTEX_SHADER, vertSource);
  if (!vertexShader)
  {
    console.log("Error compiling vert shader.");
    return;
  }

  var fragmentShader = CreateShader(context, context.FRAGMENT_SHADER, fragSource);
  if (!fragmentShader)
  {
    console.log("Error compiling frag shader.");
    return;
  }

  program = CreateProgram(context, vertexShader, fragmentShader);
  if (!fragmentShader)
  {
    console.log("Error compiling frag shader.");
    return;
  }
  return program;
}

function CreateGLBuffer(glObject, infoForBufferArray)
{
  var buffer = glObject.context.createBuffer();
  glObject.context.bindBuffer(glObject.context.ARRAY_BUFFER, buffer);
  glObject.context.bufferData(glObject.context.ARRAY_BUFFER, new Float32Array(infoForBufferArray), glObject.context.STATIC_DRAW);
  return buffer;
}

function SetGLAttribute(glObject, shader, stringAttributeName, bufferToReadFrom, intSizeToPull)
{
  var location = glObject.context.getAttribLocation(shader, stringAttributeName);
  glObject.context.enableVertexAttribArray(location);
  glObject.context.bindBuffer(glObject.context.ARRAY_BUFFER, bufferToReadFrom);
  glObject.context.vertexAttribPointer(location, intSizeToPull, glObject.context.FLOAT, false, 0, 0);
}

function SetGLUniformFloat(glObject, shader, stringUniformName, floatValue)
{
  var location = glObject.context.getUniformLocation(shader, stringUniformName);
  glObject.context.uniform1f(location, floatValue);
}

function SetGLUniformFloatArray(glObject, shader, stringUniformName, floatArray)
{
  var location = glObject.context.getUniformLocation(shader, stringUniformName);
  glObject.context.uniform1fv(location, floatArray);
}

function SetGLUniformVec2(glObject, shader, stringUniformName, floatValue1, floatValue2)
{
  var location = glObject.context.getUniformLocation(shader, stringUniformName);
  glObject.context.uniform2f(location, floatValue1, floatValue2);
}

function ResizeGLCanvas(glObject)
{
  glObject.context.viewport(0, 0, glObject.canvas.width, glObject.canvas.height);
  glObject.canvas.width = glObject.canvas.clientWidth/page.banner.gl.object.size.scaler;
  glObject.canvas.height = glObject.canvas.clientHeight/page.banner.gl.object.size.scaler;
}

function ClearGLCanvas(glObject)
{
  glObject.context.clearColor(0, 0, 0, 0);
  glObject.context.clear(glObject.context.COLOR_BUFFER_BIT);
}

function SetGLCanvasShader(glObject, compiledShader)
{
  glObject.context.useProgram(compiledShader);
}

function DrawGLCanvas(glObject)
{
  glObject.context.drawArrays(glObject.context.TRIANGLES, 0, 6); //0 offset, 6 points = 2 x TRIANGLES.
}

function UploadTexturesToShader(glObject, shader, arrayOfTextures)
{
  for (var texIndex = 0; texIndex < arrayOfTextures.length; texIndex++)
  {
    glObject.context.uniform1i(glObject.context.getUniformLocation(shader, "u_tex" + texIndex), texIndex);
  }
  for (var texIndex = 0; texIndex < arrayOfTextures.length; texIndex++)
  {
    glObject.context.activeTexture(glObject.context.TEXTURE0 + texIndex);
    glObject.context.bindTexture(glObject.context.TEXTURE_2D, arrayOfTextures[texIndex]);
  }
  //WebGL does not like this being done all at once in 1 loop. It needs to be done in steps or bindings get overwritten.
}

function CreateRenderTexture (context, width, height)
{
  var targetTexture = context.createTexture();
  context.bindTexture(context.TEXTURE_2D, targetTexture);
  var internalFormat = context.RGBA;
  var format = context.RGBA;
  var type = context.UNSIGNED_BYTE;
  context.texImage2D(context.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null);
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
  return targetTexture;
}

function CreateRenderBuffer (context, textureToBindToIt)
{
  var buffer = context.context.createFramebuffer();

  context.context.bindFramebuffer(context.context.FRAMEBUFFER, buffer);
  context.context.framebufferTexture2D(context.context.FRAMEBUFFER, context.context.COLOR_ATTACHMENT0, context.context.TEXTURE_2D, textureToBindToIt, 0);
  context.context.bindFramebuffer(context.context.FRAMEBUFFER, null);
  return buffer;
}

function SetRenderTarget (context, buffer)
{
  context.context.bindFramebuffer(context.context.FRAMEBUFFER, buffer );
}

function GetWebGLImages() {
  var loadedImages = [];
  var imagesToLoad = page.banner.gl.textures.sources.length;

  // Called each time an image finished loading.
  var onImageLoad = function() {
    --imagesToLoad;
    // If all the images are loaded call the callback.
    if (imagesToLoad == 0) {
      page.banner.gl.textures.sources = loadedImages;
      GetWebGLTextures(page.banner.gl.object.context);
    }
  };

  for (var imageIndex = 0; imageIndex < imagesToLoad; imageIndex++) {
    var image = LoadImage(page.banner.gl.textures.sources[imageIndex], onImageLoad);
    loadedImages.push(image);
  }
}

function GetWebGLTextures(context)
{
  var glTextures = [];
  if (context != null)
  {
    for (var imageIndex = 0; imageIndex < page.banner.gl.textures.sources.length; imageIndex++)
    {
      var tex = context.createTexture();

      var wrapMode, filterMode;
      if (page.banner.gl.textures.texturespecs[imageIndex][0] == "bilinear") {filterMode = context.LINEAR;}
      else {filterMode = context.NEAREST;}
      if (page.banner.gl.textures.texturespecs[imageIndex][1] == "wrap") {wrapMode = context.REPEAT;}
      else {wrapMode = context.CLAMP_TO_EDGE;}

      context.bindTexture(context.TEXTURE_2D, tex);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, wrapMode);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, wrapMode);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, filterMode);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, filterMode);
      context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, page.banner.gl.textures.sources[imageIndex]);
      glTextures.push(tex);
    }
    page.banner.gl.textures.sources = glTextures;
  }
  page.banner.gl.textures.loaded = true;
}

//General Utility / Misc
function Timer() {
  setTimeout(function() {
        if (page.time.first == null) {page.time.first = Date.now() / 1000;}
        page.time.current = Date.now() / 1000;
        page.time.delta = page.time.current - page.time.last;
        page.time.time =  (page.time.current -  page.time.first);
        page.time.last = page.time.current;

        if (page.loaded) {Update();}
        else {AsyncStart();}

        requestAnimationFrame(Timer);
    }, 1000 / page.fps);
}

function LoadImage(src, callback) {
  var image = new Image();
  image.src = src;
  image.onload = callback;
  return image;
}

function rgba(r, g, b, a){
  return "rgb("+r+","+g+","+b+","+a+")";
}

function Lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

function IncrementSlideIndex(n) {
  slideTimer = 0;
  slideIndex += n;
}

function SetSlideIndex(n) {
  slideTimer = 0;
  slideIndex = n;
}


function ShowSlides(n) {
  var i;
  var slides = document.getElementsByClassName("services");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}
//Remove below when an email form is created. Ask Chris for the PHP file.
/*
function EmailValidationCheck()
{
  var nameValue = document.forms["contactForm"]["name"].value,
    emailValue = document.forms["contactForm"]["mail"].value,
    messageValue = document.forms["contactForm"]["message"].value;
  var nameValid = false,
    emailValid = false,
    messageValid = false;
  var errorString = "Not filled correctly. \n";

  //Name check.
  if (nameValue=="") {errorString+="You must provide your name. \n";}
  else {nameValid = true;}

  //Email check.
  if (emailValue=="") {errorString+="You must provide your email. \n";}
  else if (!emailValue.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {errorString+="You must provide a correct email address. \n";}
  else {emailValid = true;}

  //Message check.
  if (messageValue=="") {errorString+="You must provide a message. \n";}
  else {messageValid = true;}

 var sendable = nameValid && emailValid && messageValid;
 if (sendable){alert("You sent a message to me successfully.");}
 else {alert(errorString);}
 return sendable;
}
*/

//WebGl Helpers
function CompileShader(context, vertSource, fragSource)
{
  var program = null;
  function CreateShader(context, type, source) {
    var shader = context.createShader(type);
    context.shaderSource(shader, source);
    context.compileShader(shader);
    var success = context.getShaderParameter(shader, context.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(context.getShaderInfoLog(shader));
    context.deleteShader(shader);
  }

  function CreateProgram(context, vertexShader, fragmentShader) {
    var program = context.createProgram();
    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);
    context.linkProgram(program);
    var success = context.getProgramParameter(program, context.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(context.getProgramInfoLog(program));
    context.deleteProgram(program);
  }

  var vertexShader = CreateShader(context, context.VERTEX_SHADER, vertSource);
  if (!vertexShader)
  {
    console.log("Error compiling vert shader.");
    return;
  }

  var fragmentShader = CreateShader(context, context.FRAGMENT_SHADER, fragSource);
  if (!fragmentShader)
  {
    console.log("Error compiling frag shader.");
    return;
  }

  program = CreateProgram(context, vertexShader, fragmentShader);
  if (!fragmentShader)
  {
    console.log("Error compiling frag shader.");
    return;
  }
  return program;
}

function CreateGLBuffer(glObject, infoForBufferArray)
{
  var buffer = glObject.context.createBuffer();
  glObject.context.bindBuffer(glObject.context.ARRAY_BUFFER, buffer);
  glObject.context.bufferData(glObject.context.ARRAY_BUFFER, new Float32Array(infoForBufferArray), glObject.context.STATIC_DRAW);
  return buffer;
}

function SetGLAttribute(glObject, shader, stringAttributeName, bufferToReadFrom, intSizeToPull)
{
  var location = glObject.context.getAttribLocation(shader, stringAttributeName);
  glObject.context.enableVertexAttribArray(location);
  glObject.context.bindBuffer(glObject.context.ARRAY_BUFFER, bufferToReadFrom);
  glObject.context.vertexAttribPointer(location, intSizeToPull, glObject.context.FLOAT, false, 0, 0);
}

function SetGLUniformFloat(glObject, shader, stringUniformName, floatValue)
{
  var location = glObject.context.getUniformLocation(shader, stringUniformName);
  glObject.context.uniform1f(location, floatValue);
}

function SetGLUniformFloatArray(glObject, shader, stringUniformName, floatArray)
{
  var location = glObject.context.getUniformLocation(shader, stringUniformName);
  glObject.context.uniform1fv(location, floatArray);
}

function SetGLUniformVec2(glObject, shader, stringUniformName, floatValue1, floatValue2)
{
  var location = glObject.context.getUniformLocation(shader, stringUniformName);
  glObject.context.uniform2f(location, floatValue1, floatValue2);
}

function ResizeGLCanvas(glObject)
{
  glObject.context.viewport(0, 0, glObject.canvas.width, glObject.canvas.height);
  glObject.canvas.clientWidth = glObject.canvas.clientWidth/page.banner.gl.object.size.scaler;
  glObject.canvas.clientHeight = glObject.canvas.clientHeight/page.banner.gl.object.size.scaler;
}

function ClearGLCanvas(glObject)
{
  glObject.context.clearColor(0, 0, 0, 0);
  glObject.context.clear(glObject.context.COLOR_BUFFER_BIT);
}

function SetGLCanvasShader(glObject, compiledShader)
{
  glObject.context.useProgram(compiledShader);
}

function DrawGLCanvas(glObject)
{
  glObject.context.drawArrays(glObject.context.TRIANGLES, 0, 6); //0 offset, 6 points = 2 x TRIANGLES.
}

function UploadTexturesToShader(glObject, shader, arrayOfTextures)
{
  for (var texIndex = 0; texIndex < arrayOfTextures.length; texIndex++)
  {
    glObject.context.uniform1i(glObject.context.getUniformLocation(shader, "u_tex" + texIndex), texIndex);
  }
  for (var texIndex = 0; texIndex < arrayOfTextures.length; texIndex++)
  {
    glObject.context.activeTexture(glObject.context.TEXTURE0 + texIndex);
    glObject.context.bindTexture(glObject.context.TEXTURE_2D, arrayOfTextures[texIndex]);
  }
  //WebGL does not like this being done all at once in 1 loop. It needs to be done in steps or bindings get overwritten.
}

function CreateRenderTexture (context, width, height)
{
  var targetTexture = context.createTexture();
  context.bindTexture(context.TEXTURE_2D, targetTexture);
  var internalFormat = context.RGBA;
  var format = context.RGBA;
  var type = context.UNSIGNED_BYTE;
  context.texImage2D(context.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null);
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
  return targetTexture;
}

function CreateRenderBuffer (context, textureToBindToIt)
{
  var buffer = context.context.createFramebuffer();

  context.context.bindFramebuffer(context.context.FRAMEBUFFER, buffer);
  context.context.framebufferTexture2D(context.context.FRAMEBUFFER, context.context.COLOR_ATTACHMENT0, context.context.TEXTURE_2D, textureToBindToIt, 0);
  context.context.bindFramebuffer(context.context.FRAMEBUFFER, null);
  return buffer;
}

function SetRenderTarget (context, buffer)
{
  context.context.bindFramebuffer(context.context.FRAMEBUFFER, buffer );
}

function GetWebGLImages() {
  var loadedImages = [];
  var imagesToLoad = page.banner.gl.textures.sources.length;

  // Called each time an image finished loading.
  var onImageLoad = function() {
    --imagesToLoad;
    // If all the images are loaded call the callback.
    if (imagesToLoad == 0) {
      page.banner.gl.textures.sources = loadedImages;
      GetWebGLTextures(page.banner.gl.object.context);
    }
  };

  for (var imageIndex = 0; imageIndex < imagesToLoad; imageIndex++) {
    var image = LoadImage(page.banner.gl.textures.sources[imageIndex], onImageLoad);
    loadedImages.push(image);
  }
}

function GetWebGLTextures(context)
{
  var glTextures = [];
  if (context != null)
  {
    for (var imageIndex = 0; imageIndex < page.banner.gl.textures.sources.length; imageIndex++)
    {
      var tex = context.createTexture();

      var wrapMode, filterMode;
      if (page.banner.gl.textures.texturespecs[imageIndex][0] == "bilinear") {filterMode = context.LINEAR;}
      else {filterMode = context.NEAREST;}
      if (page.banner.gl.textures.texturespecs[imageIndex][1] == "wrap") {wrapMode = context.REPEAT;}
      else {wrapMode = context.CLAMP_TO_EDGE;}

      context.bindTexture(context.TEXTURE_2D, tex);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, wrapMode);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, wrapMode);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, filterMode);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, filterMode);
      context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, page.banner.gl.textures.sources[imageIndex]);
      glTextures.push(tex);
    }
    page.banner.gl.textures.sources = glTextures;
  }
  page.banner.gl.textures.loaded = true;
}
