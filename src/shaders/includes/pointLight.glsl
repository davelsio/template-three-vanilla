vec3 pointLight(vec3 color, float intensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 vertexPosition, float lightDecay) {
    vec3 lightDelta = lightPosition - vertexPosition;
    float lightDistance = length(lightDelta); // distance from the light to the vertex
    vec3 lightDirection = normalize(lightDelta); // direction from the light to the vertex
    vec3 lightReflection = reflect(-lightDirection, normal); // towards the surface

    // Shading
    float shading = dot(normal, lightDirection);
    shading = max(shading, 0.0); // ensure shading >= 0

    // Specular
    float specular = -dot(lightReflection, viewDirection); // invert the light reflection
    specular = max(specular, 0.0); // ensure specular >= 0
    specular = pow(specular, specularPower); // reduce the power

    // Decay
    float decay = 1.0 - lightDistance * lightDecay;
    decay = max(0.0, decay);

    return color * intensity * decay * (shading + specular);
}
