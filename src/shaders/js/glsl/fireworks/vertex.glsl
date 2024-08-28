uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;
attribute float aTimeMultiplier;

float remap(float value, float inputMin, float inputMax, float outputMin, float outputMax)
{
    return outputMin + (outputMax - outputMin) * (value - inputMin) / (inputMax - inputMin);
}

void main()
{    
    float time = aTimeMultiplier * uProgress;

    // Position
    vec3 newPosition = position;

    // Explosion
    float explosion = remap(time, 0.0, 0.1, 0.0, 1.0);
    explosion = clamp(explosion, 0.0, 1.0);
    explosion = 1.0 - pow(1.0 - explosion, 3.0);
    newPosition *= explosion;

    // Falling
    float falling = remap(time, 0.1, 1.0, 0.0, 1.0);
    falling = clamp(falling, 0.0, 1.0);
    falling = 1.0 - pow(1.0 - falling, 3.0);
    newPosition.y -= falling * 0.2;

    // Scaling
    float scalingBegin = remap(time, 0.0, 0.125, 0.0, 1.0);
    float scalingEnd = remap(time, 0.125, 1.0, 1.0, 0.0);
    float scaling = min(scalingBegin, scalingEnd);
    scaling = clamp(scaling, 0.0, 1.0);

    // Twinkling
    float twinkling = remap(time, 0.2, 0.8, 0.0, 1.0);
    twinkling = clamp(twinkling, 0.0, 1.0);
    float sizeTwinkling = sin(time * 30.0) * 0.5 + 0.5;
    sizeTwinkling = 1.0 - sizeTwinkling * twinkling;

    // Final Position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;

    // Size
    gl_PointSize = (uSize * uResolution.y * aSize / -viewPosition.z) * scaling * sizeTwinkling;
    // gl_PointSize *= (1.0 / -viewPosition.z);
}