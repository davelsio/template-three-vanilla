uniform vec2 uResolution;
uniform float uSize;
uniform float uTime;

attribute float aScale;

varying float vPointSize;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // Randomize y-axis offset
  float yOffset = (sin(uTime + modelPosition.z * 100.0) + 1.0) / 2.0;
  modelPosition.y += yOffset * aScale * 0.2;

  float xOffset = (cos(uTime * modelPosition.z) * 2.5) / 20.0;
  modelPosition.x += xOffset * (aScale) * 1.2;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_Position = projectionPosition;

  /**
   * Firefly size adjusted by pixel ratio and distance from camera. Emulates
   * the `sizeAttenuation` of THREE.PointsMaterial.
   *
   *   Adjusting to the device pixel ratio ensures the particle will have
   *   the same size regardless of the device's pixel density.
   *
   *     uSize:  <const> * uResolution.y
   *
   *   Scaling each particle randomly creates a more natural feeling.
   *
   *     aScale: random value from [0.5, 1.0]
   *
   *   The final scaling ensures particles will be slightly smaller when
   *   zooming out and larger when zooming in. The idea is not to preserve
   *   their relative size regardless of the zoom level, but to have a more
   *   natural scaling behavior.
   *
   *     uScale: second scale factor -> half the scene height.
   */
  gl_PointSize = uSize * uResolution.y * aScale;
  gl_PointSize *= 1.0 / -viewPosition.z;

  vPointSize = gl_PointSize;
}