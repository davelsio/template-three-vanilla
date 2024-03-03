uniform float uAlpha;
uniform float uProgress;

// varying vec3 vPosition;
varying vec2 vUv;

void main() {
  /**
   * The value of vPosition.x exists in the interval [-0.5, +0.5], but the value
   * of uProgress should be in the interval [0, 1]. Therefore, we just need an
   * adjustment of 0.5 to get the correct value.
   */
  // float loc = step(uProgress, vPosition.x + 0.5);

  /**
   * Alternatively, the value of vUv.x already exists in the interval [0, 1].
   * Therefore, it matches the uProgress range and can be effectively used instead
   * of vPosition.x.
   */
  float loc = step(uProgress, vUv.x);

  /**
   * Because the step() function will return 0.0 if the value is less than
   * vPosition.x, the inverse is needed to color the fragment as white.
   */
  vec3 color = clamp(vec3(1.0 - loc), vec3(0.3), vec3(1.0));
  gl_FragColor = vec4(color, uAlpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
