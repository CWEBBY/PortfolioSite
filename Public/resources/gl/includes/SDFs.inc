float sdfPole(vec2 position, vec2 pointA, vec2 pointB)
{
    vec2 positionToA = position - pointA;
    vec2 aToB = pointB - pointA;
    float positionToPole = clamp(dot(positionToA, aToB) / dot(aToB, aToB), 0., 1.);
    return length(positionToA - aToB * positionToPole);
}

float sdfAxis(vec2 position, vec2 pointA, vec2 pointB)
{
    vec2 positionToA = position - pointA;
    vec2 aToB = pointB - pointA;
    float positionToPole = clamp(dot(positionToA, aToB) / dot(aToB, aToB), 0., 1.);
    return length(positionToA - aToB * positionToPole);
}

float sdfTorus(vec3 viewPos, vec3 pos, vec2 t) { 
    pos = viewPos - pos;
    return length(vec2(length(pos.xz)-t.x,pos.y))-t.y; 
}

float sdfCylinder(vec3 p, vec3 a, vec3 b, float r)
{
    vec3 ab = b-a;
    vec3 ap = p-a;
    float t = dot(ab, ap) / dot(ab, ab);
    vec3 c = a + t*ab;
    float x = length(p-c)-r;
    float y = (abs(t-.5)-.5)*length(ab);
    float e = length(max(vec2(x, y), 0.));
    float i = min(max(x, y), 0.);
    return e+i;
}

float sdfSphere(vec3 position, float radius)
{
    return length(position) - radius;
}

float sdfPlane(vec3 pos, vec3 normal, float height)
{
    return dot(pos, normal) + -height;
}
