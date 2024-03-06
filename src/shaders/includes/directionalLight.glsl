vec3 directionalLight(vec3 color, float intensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower) {
    vec3 lightDirection = normalize(lightPosition);
    vec3 lightReflection = reflect(-lightDirection, normal); // towards the surface

    // Shading
    float shading = dot(normal, lightDirection);
    shading = max(shading, 0.0); // ensure shading >= 0

    // Specular
    float specular = -dot(lightReflection, viewDirection); // invert the light reflection
    specular = max(specular, 0.0); // ensure specular >= 0
    specular = pow(specular, specularPower); // reduce the power

    return (color * intensity) * (shading + specular);
}
