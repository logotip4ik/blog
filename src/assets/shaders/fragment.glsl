precision highp float;

uniform float time;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;
varying vec3 vSurfaceToView;
varying vec3 vNormal;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}