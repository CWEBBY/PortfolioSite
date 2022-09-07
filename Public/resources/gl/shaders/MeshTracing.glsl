#shader vertex
uniform vec2 u_Resolution;

attribute vec4 a_Position;
attribute vec2 a_Texcoords;

varying vec2 v_RayDir;

void main()
{
    v_RayDir = ((a_Texcoords - .5) * u_Resolution) / u_Resolution.y;
    gl_Position = a_Position;
}

#shader fragment
precision highp float;

#define INF 999999. 
#define EPS .000001 
#define MAX_VERTS (4096 * 4096) 

uniform sampler2D u_Mesh;

uniform int u_VerticesCount;
uniform float u_CameraYRotation;

varying vec2 v_RayDir;

mat2 rotate(float angle) 
{ 
    return mat2(
        vec2(cos(angle), -sin(angle)),
        vec2(sin(angle), cos(angle))
    ); 
}

void main()
{
    vec3 color = vec3(0);

    vec3 cameraPosition = vec3(0., 7.5, -25.);  
    vec3 cameraDirection = normalize(vec3(v_RayDir - vec2(0., .125), 1.));

    cameraPosition.xz *= rotate(u_CameraYRotation);
    cameraDirection.xz *= rotate(u_CameraYRotation);

    float texelWidth = 1. / float(u_VerticesCount);
   
    for (int i = 0; i < MAX_VERTS; i += 3) 
    {
        if (i >= u_VerticesCount) break; 

        vec3 v1 = texture2D(u_Mesh, vec2(i + 0, 0)).rgb;
        vec3 v2 = texture2D(u_Mesh, vec2(i + 1, 0)).rgb;
        vec3 v3 = texture2D(u_Mesh, vec2(i + 2, 0)).rgb;

        Ray eyeRay = Ray(cameraPosition, cameraDirection);
        IntersectResult test = trace(eyeRay);

        if (test.hit)
        {
            
        }
    }
    
    gl_FragColor = vec4(color, 1);
}