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
varying vec2 v_uv;

#include Lighting
#include Random
#include Marching

uniform float u_rotation;

uniform sampler2D u_evoBadgeTex;
uniform sampler2D u_vapourwaveTex;
uniform sampler2D u_woodgrainAlbedoTex;
uniform sampler2D u_woodgrainNormalTex;
uniform sampler2D u_woodgrainGlossTex;

struct Material
{
    vec4 albedo;
    vec3 normal;
    float gloss;
};

struct SDFObject
{
    float dist;
    int id;
};

struct Ray
{
    vec3 startPos;
    vec3 endPos;
    vec3 dir;
    vec3 vel;
    int steps;
    Material hitMat;
};

vec2 NormalizeUV(vec2 OldUV) {return ((OldUV - .5) * u_resolution) / u_resolution.y;} //normalize to screen res.
mat2 Rotate(float angle) { return mat2(cos(angle),-sin(angle),sin(angle),cos(angle)); }
SDFObject SDFGroundPlane(vec3 pos) { return SDFObject(pos.y, 1); }
float SDFTorus(vec3 p, vec2 t) { return length(vec2(length(p.xz)-t.x,p.y))-t.y; }
float SmoothMin( float a, float b, float k ) { return min( a, b ) - (max( k-abs(a-b), 0.0 )/k)*(max( k-abs(a-b), 0.0 )/k)*(max( k-abs(a-b), 0.0 )/k)*k*(1.0/6.0); } //SDF courtesy of Inigo Quilez / https://iquilezles.org/www/articles/smin/smin.htm
float Hash21(vec2 seed) { return fract(sin(seed.x * 1995. + seed.y * 74.) * 66547.); }

vec2 Hash22(vec2 seed)
{
    float noise = fract(sin(seed.x * 1995. + seed.y * 74.) * 66547.);
    return vec2(noise, Hash21(seed + noise));
}

float SDFCylinder(vec3 p, vec3 a, vec3 b, float r)
{
    //SDF courtesy of BigWings.
    //https://www.shadertoy.com/view/wdf3zl
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

SDFObject SDFMug1(vec3 rayPos, vec3 pos)
{
    float mugHeight = 7.;
    float mugRadius = 3.;
    float mugFloorHeight = .5;
    float mugWallWidth = .25;
    float mugHandleThickness = .4;
    float mug = SDFCylinder(rayPos, pos, pos + vec3(0., mugHeight, 0.), mugRadius);
    float handle = SDFTorus(rayPos.yzx - pos.yzx + vec3(-(mugHeight * .5), 0., -(mugHeight * .5)), vec2(mugHeight * .333 , mugHandleThickness));
    mug = SmoothMin(handle, mug, 0.5);
    float bore = SDFCylinder(rayPos, pos + vec3(0., mugFloorHeight, 0.), pos + vec3(0., mugFloorHeight, 0.) + vec3(0., mugHeight, 0.), mugRadius - mugWallWidth);
    mug = max(mug, -bore);
    float mouth = SDFTorus(rayPos.xyz - pos.xyz + vec3(0., -mugHeight, 0.), vec2(mugRadius - (mugWallWidth * .5), mugWallWidth * .5));
    mug = min(mug, mouth);
    return SDFObject(mug, 2);
}

SDFObject SDFMug2(vec3 rayPos, vec3 pos)
{
    float mugHeight = 7.;
    float mugRadius = 3.;
    float mugFloorHeight = .5;
    float mugWallWidth = .25;
    float mugHandleThickness = .4;
    float mug = SDFCylinder(rayPos, pos, pos + vec3(0., mugHeight, 0.), mugRadius);
    float handle = SDFTorus(rayPos.yxz - pos.yxz + vec3(-(mugHeight * .5), 0., (mugHeight * .5)), vec2(mugHeight * .333 , mugHandleThickness));
    mug = SmoothMin(handle, mug, 0.5);
    float bore = SDFCylinder(rayPos, pos + vec3(0., mugFloorHeight, 0.), pos + vec3(0., mugFloorHeight, 0.) + vec3(0., mugHeight, 0.), mugRadius - mugWallWidth);
    mug = max(mug, -bore);
    float mouth = SDFTorus(rayPos.xyz - pos.xyz + vec3(0., -mugHeight, 0.), vec2(mugRadius - (mugWallWidth * .5), mugWallWidth * .5));
    mug = min(mug, mouth);
    return SDFObject(mug, 3);
}

SDFObject GetSceneInfo(vec3 currentPos)
{
    SDFObject closestThing = SDFObject(MAX_DIST, 0);

    SDFObject evoMug = SDFMug1(currentPos, vec3(-6.25, 0., -6.25));
    closestThing.dist = closestThing.dist < evoMug.dist ? closestThing.dist : evoMug.dist;
    closestThing.id = closestThing.dist < evoMug.dist ? closestThing.id : evoMug.id;

    SDFObject vapeMug = SDFMug2(currentPos, vec3(6.25, 0., 6.25));
    closestThing.dist = closestThing.dist < vapeMug.dist ? closestThing.dist : vapeMug.dist;
    closestThing.id = closestThing.dist < vapeMug.dist ? closestThing.id : vapeMug.id;

    SDFObject groundPlane = SDFGroundPlane(currentPos);
    closestThing.dist = closestThing.dist < groundPlane.dist ? closestThing.dist : groundPlane.dist;
    closestThing.id = closestThing.dist < groundPlane.dist ? closestThing.id : groundPlane.id;

    return closestThing;
}

vec3 GetNormal(vec3 Pos)
{
    vec2 offset = vec2(.01, .0);
    vec3 normal;
    normal.x = GetSceneInfo(Pos + offset.xyy).dist - GetSceneInfo(Pos - offset.xyy).dist;
    normal.y = GetSceneInfo(Pos + offset.yxy).dist - GetSceneInfo(Pos - offset.yxy).dist;
    normal.z = GetSceneInfo(Pos + offset.yyx).dist - GetSceneInfo(Pos - offset.yyx).dist;
    return normalize(normal);
}

Material GetPBSMaterial(vec3 IntersectPos, vec3 Normal, int ID)
{
    //Polar mapping UV was WAY easier once I learned about it. Thanks to BigWings from ShaderToy. https://www.youtube.com/watch?v=r1UOB8NVE8I.
    //I feel the need to stress that this is BASIC PBS, like, barely even PBS, just albedo and gloss...
    Material mat;

    if (ID < 1)
    {
        //Material missing...
        mat.albedo = vec4(0.);
        mat.normal = vec3(0.);
        mat.gloss = 0.;
    }
    else if (ID < 2)
    {
        mat.albedo = texture2D(u_woodgrainAlbedoTex, fract(IntersectPos.xz * .05));
        mat.normal = (texture2D(u_woodgrainNormalTex, fract(IntersectPos.xz * .05)).rgb * 2.) - 1.;
        mat.gloss = texture2D(u_woodgrainGlossTex, fract(IntersectPos.xz * .05)).r ;
    }
    else if (ID < 3)
    {
        mat.albedo = texture2D(u_vapourwaveTex, vec2( atan((-6.25 - IntersectPos.z), (-6.25 - IntersectPos.x)) / (3.1415269 * 2.) + .5, 1. - (IntersectPos.y / 7.)));
        mat.normal = Normal;
        mat.gloss = .15;

    }
    else if (ID < 4)
    {
        mat.albedo = texture2D(u_evoBadgeTex, vec2( 1. - (atan(-(6.25 - IntersectPos.x), -(6.25 - IntersectPos.z)) / (3.14159265 * 2.) + .5), 1. - (IntersectPos.y / 7.)));
        mat.normal = Normal;
        mat.gloss = .15;
    }

    //After all of that, I hope to never do projection mapping again...
    return mat;
}

Ray MarchRay(vec3 rayPos, vec3 rayDir)
{
    Ray march;
    SDFObject closestObj;   

    march.startPos = rayPos;
    march.endPos = rayPos;
    march.dir = rayDir;
    march.vel = vec3(0.);
    march.steps = 0;

    for (int step = 0; step < MAX_STEPS; step++)
    {      
        closestObj = GetSceneInfo(march.endPos);
        march.steps = step;
        if (closestObj.dist < MIN_DIST || closestObj.dist > MAX_DIST) { break; }
        march.vel += closestObj.dist;
        march.endPos = march.startPos + (march.dir * march.vel);
    }

    march.endPos = march.startPos + (march.vel * march.dir);
    march.hitMat = GetPBSMaterial(march.endPos, GetNormal(march.endPos), closestObj.id);
    return march;
}

float SoftShadow(vec3 RayPos, vec3 RayDir)
{
    //THANK YOU SO MUCH INIGO, I WAS STUCK ON THIS FOR A WHILE UNTIL I FOUND YOUR SOLUTION.
    //https://iquilezles.org/www/articles/rmshadows/rmshadows.htm

    float distanceFromPosition = 0.;
    float distanceToSurface = 0.;
    float penumbra = 1.;

    for (int step = 0; step < MAX_STEPS; step++)
    {
        if (distanceFromPosition < MAX_DIST)
        {
            distanceToSurface = GetSceneInfo(RayPos + (RayDir * distanceFromPosition)).dist;
            if (distanceToSurface < MIN_DIST) { return 0.; }
            penumbra = min(penumbra, .5 * distanceToSurface / distanceFromPosition);
            distanceFromPosition += distanceToSurface;
        } 
    }
    return penumbra;
}

vec3 Diffuse(Ray ray)
{
    vec3 diffuseColor = vec3(0.);
    for (int i = 0; i < NUMBER_OF_LIGHTS; i++)
    {       
        vec3 lightDir = u_lightPositions[i] - ray.endPos;
        float shadowTerm = u_shadowsEnabled < 1 ? 1. : SoftShadow(ray.endPos + (ray.hitMat.normal * MIN_DIST), normalize(lightDir));
        vec3 lightCol = u_lightColors[i] * pow(clamp(1.0 - (length(lightDir) / LIGHT_RADIUS), 0.0, 1.0), 2.);  //Inverse square falloff.
        float diffTerm = max(0., dot(ray.hitMat.normal, normalize(lightDir)));
        float lightFlare = pow(max(dot(reflect(-normalize(u_lightPositions[i] - ray.startPos), ray.dir), ray.dir), 0.), 512.);
        lightFlare += pow(max(dot(reflect(-normalize(lightDir), ray.hitMat.normal), -ray.dir), 0.), 1024.);
        diffuseColor += lightCol * diffTerm * shadowTerm * ray.hitMat.albedo.rgb;
        //diffuseColor += lightFlare * u_lightColors[i] * shadowTerm;
        diffuseColor += lightFlare * shadowTerm * u_lightColors[i];
    }
    //return ray.hitMat.albedo.rgb * diffuseColor;
    return diffuseColor;
    // One day, I'll come back and add a glass that refracts...
}

void main()
{
    vec3 diffuse = vec3(0.); //Do skybox of some sort...
    vec3 specular = vec3(0.); //Do skybox of some sort...
    vec2 uv = NormalizeUV(v_uv);

    vec3 cameraPosition = vec3(0., 7.5, -25.);
    vec3 cameraDirection = normalize(vec3(uv.x, uv.y - .125, 1.));

    cameraPosition.xz *= Rotate(u_rotation);
    cameraDirection.xz *= Rotate(u_rotation);

    Ray ray = MarchRay(cameraPosition, cameraDirection);
    diffuse = Diffuse(ray); 
    if (u_reflectionsEnabled >= 1)
    {
        for (int i = 0; i < LIGHT_BOUNCES; i++)
        {
            float specGloss = ray.hitMat.gloss;
            ray.endPos += (ray.hitMat.normal * MIN_DIST);
            ray = MarchRay(ray.endPos, reflect(ray.dir, ray.hitMat.normal));
            specular += Diffuse(ray) * specGloss; 
        }
    }        
    vec3 color = diffuse + specular;
    gl_FragColor = vec4(sqrt(clamp(color, 0., 1.)), 1.); //Gamma color space, courtesy of https://www.shadertoy.com/view/4dt3zn.
}