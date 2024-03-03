uniform vec3 uColor;
uniform float uSize;

varying float vPointSize;

void main() {
  /**
   * Unlike in 28-shader-patterns, the geometry is not a plane, but a vertex.
   * Therefore, passing the vertex uv as a varying is no longer suitable to
   * create the firefly pattern. Instead, we can use the fragment position
   * within the particle, given by `gl_PointCoord`.
   *
   *   `gl_PointCoord` is a vec2 and contains the x and y coordinates of the
   *    fragment within the vertex point. The snippet below shows the classical
   *    uv coordinates pattern.
   *
   *      gl_FragColor = vec4(gl_PointCoord, 1.0, 1.0);
   *
   *    Do not confuse it with `gl_FragCoord`, which is a vec3 and contains
   *    the window-relative coordinates of the fragment.
   */

  // Calculate the distance of the fragment to the center of the point.
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5, 0.5));

  // Compute the alpha value of the fragment depending on its firefly position.
  float strength = (0.05 / distanceToCenter) - 0.1;
  //float strength = (uSize / distanceToCenter) - uSize * 2.0;
  //float strength = (vPointSize / distanceToCenter) - vPointSize * 2.0;

  gl_FragColor = vec4(uColor, strength);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}