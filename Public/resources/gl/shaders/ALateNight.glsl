#shader vertex
#include Auto

attribute vec4 a_Position;
attribute vec2 a_Texcoords;

varying vec2 v_RayDir;

void main()
{
    vec2 normalizedTexcoords = 
        (a_Texcoords - .5) * u_Resolution;

    v_RayDir = 
        normalizedTexcoords / u_Resolution.y;

    gl_Position = a_Position;
}

#shader fragment
precision highp float;
varying vec2 v_RayDir;

#include Auto
#include Lighting
#include Raytracing
#include Raymarching

uniform mat4 u_V_MATRIX;

uniform float u_rotation;
uniform sampler2D u_evoBadgeTex;
uniform sampler2D u_vapourwaveTex;
uniform sampler2D u_woodgrainAlbedoTex;
uniform sampler2D u_woodgrainNormalTex;
uniform sampler2D u_woodgrainGlossTex;

// Material GetPBSMaterial(vec3 IntersectPos, vec3 Normal, int ID)
// {
//     //Polar mapping UV was WAY easier once I learned about it. Thanks to BigWings from ShaderToy. https://www.youtube.com/watch?v=r1UOB8NVE8I.
//     //I feel the need to stress that this is BASIC PBS, like, barely even PBS, just albedo and gloss...
//     Material mat;

//     if (ID < 1)
//     {
//         //Material missing...
//         mat.albedo = vec4(0.);
//         mat.normal = vec3(0.);
//         mat.gloss = 0.;
//     }
//     else if (ID < 2)
//     {
//         mat.albedo = texture2D(u_woodgrainAlbedoTex, fract(IntersectPos.xz * .05));
//         mat.normal = (texture2D(u_woodgrainNormalTex, fract(IntersectPos.xz * .05)).rgb * 2.) - 1.;
//         mat.gloss = texture2D(u_woodgrainGlossTex, fract(IntersectPos.xz * .05)).r ;
//     }
//     else if (ID < 3)
//     {
//         mat.albedo = texture2D(u_vapourwaveTex, vec2( atan((-6.25 - IntersectPos.z), (-6.25 - IntersectPos.x)) / (3.1415269 * 2.) + .5, 1. - (IntersectPos.y / 7.)));
//         mat.normal = Normal;
//         mat.gloss = .15;

//     }
//     else if (ID < 4)
//     {
//         mat.albedo = texture2D(u_evoBadgeTex, vec2( 1. - (atan(-(6.25 - IntersectPos.x), -(6.25 - IntersectPos.z)) / (3.14159265 * 2.) + .5), 1. - (IntersectPos.y / 7.)));
//         mat.normal = Normal;
//         mat.gloss = .15;
//     }

//     //After all of that, I hope to never do projection mapping again...
//     return mat;
// }

// float MarchRay(vec3 rayPos, vec3 rayDir)
// {

//     for (int step = 0; step < MAX_MARCH_STEPS; step++)
//     {      
//         closestObj = GetSceneInfo(march.endPos);
//         march.steps = step;
//         if (closestObj.dist < MIN_MARCH_DISTANCE || closestObj.dist > MAX_MARCH_DISTANCE) { break; }
//         march.vel += closestObj.dist;
//         march.endPos = march.startPos + (march.dir * march.vel);
//     }

//     march.endPos = march.startPos + (march.vel * march.dir);
//     march.hitMat = GetPBSMaterial(march.endPos, GetNormal(march.endPos), closestObj.id);
//     return march;
// }

// float SoftShadow(vec3 RayPos, vec3 RayDir)
// {
//     //THANK YOU SO MUCH INIGO, I WAS STUCK ON THIS FOR A WHILE UNTIL I FOUND YOUR SOLUTION.
//     //https://iquilezles.org/www/articles/rmshadows/rmshadows.htm

//     float distanceFromPosition = 0.;
//     float distanceToSurface = 0.;
//     float penumbra = 1.;

//     for (int step = 0; step < MAX_MARCH_STEPS; step++)
//     {
//         if (distanceFromPosition < MAX_MARCH_DISTANCE)
//         {
//             distanceToSurface = GetSceneInfo(RayPos + (RayDir * distanceFromPosition)).dist;
//             if (distanceToSurface < MIN_MARCH_DISTANCE) { return 0.; }
//             penumbra = min(penumbra, .5 * distanceToSurface / distanceFromPosition);
//             distanceFromPosition += distanceToSurface;
//         } 
//     }
//     return penumbra;
// }

// vec3 Diffuse(Ray ray)
// {
//     vec3 diffuseColor = vec3(0.);
//     for (int i = 0; i < LIGHTS_MAX_COUNT; i++)
//     {       
//         vec3 lightDir = u_LightPositions[i] - ray.endPos;
//         float shadowTerm = u_ShadowsEnabled < 1 ? 1. : SoftShadow(ray.endPos + (ray.hitMat.normal * MIN_MARCH_DISTANCE), normalize(lightDir));
//         vec3 lightCol = u_LightColors[i] * pow(clamp(1.0 - (length(lightDir) / LIGHTS_RADIUS), 0.0, 1.0), 2.);  //Inverse square falloff.
//         float diffTerm = max(0., dot(ray.hitMat.normal, normalize(lightDir)));
//         float lightFlare = pow(max(dot(reflect(-normalize(u_LightPositions[i] - ray.startPos), ray.dir), ray.dir), 0.), 512.);
//         lightFlare += pow(max(dot(reflect(-normalize(lightDir), ray.hitMat.normal), -ray.dir), 0.), 1024.);
//         diffuseColor += lightCol * diffTerm * shadowTerm * ray.hitMat.albedo.rgb;
//         //diffuseColor += lightFlare * u_LightColors[i] * shadowTerm;
//         diffuseColor += lightFlare * shadowTerm * u_LightColors[i];
//     }
//     //return ray.hitMat.albedo.rgb * diffuseColor;
//     return diffuseColor;
//     // One day, I'll come back and add a glass that refracts...
// }

float sphere(vec3 pos, float radius)
{
    return length(pos) - radius;
}

void main()
{
    vec4 worldPosRayDir = u_V_MATRIX * vec4(v_RayDir.x, v_RayDir.y, 0.0, 1.0);


    float sssss = sphere(vec3(0,0,0), 1.0);

    gl_FragColor = vec4(sssss, sssss, sssss, 1.0);
}