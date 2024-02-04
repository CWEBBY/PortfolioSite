#shader vertex
uniform vec2 u_Resolution;
uniform mat4 u_V_MATRIX;
uniform mat4 u_P_MATRIX;
uniform mat4 u_VP_MATRIX;

attribute vec4 a_Position;
attribute vec2 a_Texcoords;

varying vec2 v_rayDir;

void main()
{
    v_rayDir = a_Texcoords;
    gl_Position = a_Position;
}

#shader fragment
precision highp float;

#define VERTS 431

uniform sampler2D u_BUNNY_VERTS;

varying vec2 v_rayDir;

void main()
{
    float fov = 5.0;
    vec3 rayOrigin = vec3(0, 0, 5);
    vec3 rayDirection = vec3(v_rayDir.x * fov, v_rayDir.y * fov, 1.0);

    float vertSize = 1.0 / float(VERTS);
    for (int tri = 0; tri < VERTS; tri += 3)
    {
        vec3 v1 = texture2D(u_BUNNY_VERTS, 
            vec2(float(tri + 0) * vertSize, 0.0)).rgb;
        vec3 v2 = texture2D(u_BUNNY_VERTS, 
            vec2(float(tri + 1) * vertSize, 0.0)).rgb;
        vec3 v3 = texture2D(u_BUNNY_VERTS, 
            vec2(float(tri + 2) * vertSize, 0.0)).rgb;

        vec3 edge12 = v2 - v1;
        vec3 edge13 = v3 - v1;

        vec3 normal = cross(edge12, edge13);
        float determinant = dot(normal, v1);
        float normalDeterminant = dot(normal, rayDirection);

        if (normalDeterminant != 0) 
        {
            
        }
/*
if(nd!=0)
{    //The ray hits the triangles plane
    Intersection.t=(d- (normal).DotProduct(rayOrig))/nd
    Intersection.hitPoint=rayOrig+(rayDir*Intersection.t)
    if (pointInTriangle(Intersection.hitPoint, A, B, C))
    {
         Intersection.hasHit = true
    }
}
*/
    }

    gl_FragColor = texture2D(u_BUNNY_VERTS, v_rayDir);
}