float Rand21(vec2 seed) { return fract(sin(seed.x * 123. + seed.y * 456.) * 789.); }

vec2 Rand22(vec2 seed)
{
    float noise = fract(sin(seed.x * 123. + seed.y * 456.) * 789.);
    return vec2(noise, Rand21(seed + noise));
}

vec3 Rand23(vec2 seed)
{
    float noise = fract(sin(seed.x * 123. + seed.y * 456.) * 789.);
    return vec3(noise, Rand22(seed + noise));
}

vec4 Rand24(vec2 seed)
{
    float noise = fract(sin(seed.x * 123. + seed.y * 456.) * 789.);
    return vec4(noise, Rand23(seed + noise));
}

float SmoothRand21(vec2 uv)
{
    vec2 lv = fract(uv);
    vec2 id = floor(uv);
    lv = lv * lv * 3. - 2. * lv * lv * lv;
    float nBl = Rand21(id + vec2(0.,0.));
    float nBr = Rand21(id + vec2(1.,0.));
    float nB = mix(nBl, nBr, lv.x);
    float nTl = Rand21(id + vec2(0.,1.));
    float nTr = Rand21(id + vec2(1.,1.));
    float nT = mix(nTl, nTr, lv.x);
    float n = mix(nB, nT, lv.y);

    return n;
}