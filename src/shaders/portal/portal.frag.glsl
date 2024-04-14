uniform vec3 uColorStart;
uniform vec3 uColorEnd;
uniform float uOffsetDisplacementUv;
uniform float uOffsetStrengthUv;
uniform float uTime;

varying vec2 vUv;

#pragma glslify: perlinNoise3D = require(../includes/perlinNoise3D.glsl)

void main() {

  // Displace UV using Perlin noise
  vec2 displacedUv = vUv + perlinNoise3D(vec3(vUv * uOffsetDisplacementUv, uTime * 0.1));

  // Create black and white patterns
  float strength = perlinNoise3D(vec3(displacedUv * uOffsetStrengthUv, uTime * 0.2));

  // Add an outer glow
  float outerGlow = distance(vUv, vec2(0.5)) * 5.0 - 1.4;
  strength += outerGlow;
  strength += step(-0.2, strength); // prevent black shapes to reach the outer glow

  // Add a color gradient
  strength = clamp(strength, 0.0, 1.0); // prevent color extrapolation
  vec3 color = mix(uColorStart, uColorEnd, strength);

  // Sharpen the pattern so it matches the low-poly look

  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}

/**
 * Outer Glow
 *
 * The step function normalizes the values of the perlin noise to the range of
 * [-0.2, 1.0]. Otherwise, the value can be much higher and lower than [0.0, 1.0].
 * We still allow the lower bound to be slightly below 0.0, so that the inner black
 * core central area is not too small.
 *
 *
 * Color Gradient
 *
 * The clamp function is used to normalize the strength of the pattern to
 * [0.0, 1.0]. This is necessary so that the colors selected in the debug UI are
 * correctly displayed.
 */