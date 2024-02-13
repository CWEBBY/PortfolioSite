#shader VERTEX_SHADER

#include "./resources/gl/includes/Auto.inc"

attribute vec4 a_Position;
attribute vec2 a_Texcoords;

varying vec2 v_texcoords;
varying vec4 pos;

void main() 
{
	mat4 mvp = M * VP;

	gl_Position = vec4(a_Position.xyz, 1.) * mvp;
	pos = a_Position * vec4(a_Position.xyz, 1.) * mvp;

	v_texcoords = a_Texcoords;
}

#shader FRAGMENT_SHADER
precision highp float;

#include "./resources/gl/includes/Auto.inc"

uniform sampler2D TESTTEX;

varying vec2 v_texcoords;
varying vec4 pos;

void main() 
{
	gl_FragColor = vec4(1. - (pos.z + .5), 0, 0, 1);
}	