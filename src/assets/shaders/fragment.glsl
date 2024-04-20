precision highp float;

uniform float time;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;
varying vec3 vClearColor;
varying float vColorStrength;

void main() {
  vec3 resultingColor = mix(vClearColor, vColor, vColorStrength);

  gl_FragColor = vec4(resultingColor, 1.0);
}
