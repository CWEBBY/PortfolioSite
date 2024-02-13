#define LIGHTS_MAX_COUNT 1
#define LIGHTS_RADIUS 75.
#define LIGHTS_BOUNCES 1

uniform int u_ShadowsEnabled;
uniform int u_ReflectionsEnabled;
uniform int u_IndirectIlluminationEnabled;

uniform vec3 u_LightColors[LIGHTS_MAX_COUNT];
uniform vec3 u_LightPositions[LIGHTS_MAX_COUNT];

vec3 linearToGamma(vec3 linear) 
{
	return sqrt(clamp(linear, 0., 1.));
}
