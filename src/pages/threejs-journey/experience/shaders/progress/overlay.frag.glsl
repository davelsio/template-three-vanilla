uniform float uAlpha;

void main() {
  vec3 color = vec3(0.13, 0.1, 0.1);
  gl_FragColor = vec4(color, uAlpha);
}
