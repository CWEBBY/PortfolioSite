#shader VERTEX_SHADER

#include "./resources/gl/includes/Auto.inc"

attribute vec4 a_Position;
attribute vec3 a_Normal;

varying vec3 v_Normal;
varying vec4 pos;

void main() 
{
	mat4 MVP = M * V * P;
	
	gl_Position = MVP * a_Position;
	pos = gl_Position;

	v_Normal = a_Normal;
}

#shader FRAGMENT_SHADER
precision highp float;

#include "./resources/gl/includes/Auto.inc"

uniform sampler2D TESTTEX;

varying vec3 v_Normal;
varying vec4 pos;

void main() 
{
	gl_FragColor = vec4(v_Normal.xyz * 10.0, 1);
}	