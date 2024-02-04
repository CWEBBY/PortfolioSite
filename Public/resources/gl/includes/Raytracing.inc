#define MAX_MARCH_STEPS 75
#define MAX_MARCH_DISTANCE 75.
#define MIN_MARCH_DISTANCE .01

// MATERIAL
struct Material
{
    vec4 albedo;
    vec3 normal;
    float gloss;
};

// RAY HIT
struct RayHit
{
    vec3 position;
    Material material;
};

// RAY
struct Ray
{
    vec3 origin;
    vec3 direction;
    float distance;

    bool isHit;
    Material hitMat;
};