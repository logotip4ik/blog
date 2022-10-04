precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform float time;
uniform float randomSeed;
uniform float tilting;
uniform float inclining;
uniform float movementX;
uniform float movementY;
uniform float noiseStrength;
uniform float uColorStrength;
uniform vec3 uClearColor;
uniform vec3 uColor[4];
uniform vec2 uColorFreq;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat3 normalMatrix;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vClearColor;
varying float vColorStrength;

#include utils/noise;

void main() {
  vec2 noiseCoords = uv * vec2(4., 2.5);

  // float tilt = 0.8 * -uv.y;
  float tilt = tilting * -uv.y;

  // float incline = 0.25 * uv.x;
  float incline = inclining * uv.x;
  
  float noise = snoise(vec3(noiseCoords.x + time * movementX, noiseCoords.y + time * movementY, time * 0.1 + randomSeed));

  noise = max(-0.1, noise);

  vec3 pos = vec3(position.x, position.y, position.z + noise * noiseStrength + tilt + incline);

  vUv = uv;
  vPosition = position;
  vNormal = normalMatrix * normal;
  vColorStrength = uColorStrength;
  vClearColor = uClearColor;

  vColor = uColor[3];

  for (int i = 0; i < 3; i++) {
    float noiseFlow = 0.125 * float(i);
    float noiseSpeed = 0.25 * float(i);
    float noiseSeed = randomSeed * float(i);

    float noise = snoise(
      vec3(
        noiseCoords.x * uColorFreq.x + time * noiseFlow,
        noiseCoords.y * uColorFreq.y,
        time * noiseSpeed + noiseSeed
      )
    );

    vColor = mix(vColor, uColor[i], noise);
  }

  vColor = min(vec3(0.9125), vColor);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}