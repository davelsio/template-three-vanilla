uniform float uAlpha;
uniform vec4 uColor;

void main() {
  gl_FragColor = uColor;
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
