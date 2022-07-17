// varying vec3 vPosition;
varying vec2 vUv;

void main() {
  gl_Position = vec4(position, 1.0);

  // vPosition = position;
  vUv = uv;
}
