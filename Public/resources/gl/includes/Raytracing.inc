
#define MAX_MARCH_STEPS 75
#define MAX_MARCH_DISTANCE 75.
#define MIN_MARCH_DISTANCE .01

struct SDFObject
{
    float dist;
    int id;
};

struct Material
{
    vec4 albedo;
    vec3 normal;
    float gloss;
};

// RAY
struct Ray
{
    vec3 startPos;
    vec3 endPos;
    vec3 dir;
    vec3 vel;
    int steps;
    Material hitMat;
};


// RAY HIT
struct RayHit
{
    bool hit;
    vec3 position;
    Material material;
};