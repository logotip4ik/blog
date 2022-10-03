<script setup>
import fragmentShader from '~assets/shaders/fragment.glsl';
import vertexShader from '~assets/shaders/vertex.glsl';

import { ref, onMounted, onBeforeUnmount } from 'vue';
import { animate } from 'popmotion';
import { Renderer, Transform, Camera, Plane, Program, Mesh, Color, Vec2 } from 'ogl';

const raf = useRaf();
const { isDark } = useDarkMode();

const canvas = ref(null);

const MAX_DPR = 2.15;

const darkColors = hexToNormalizedRgb(['#f4abc4', '#595b83', '#333456', '#060930']);
const lightColors = hexToNormalizedRgb(['#fff9ca', '#ffdeb4', '#ffb4b4', '#b2a4ff']);

let colors = lightColors;

const options = {
  speedMultiplier: 1,
  colorFreqX: 1.4,
  colorFreqY: 1.3,
  tilting: 1.5,
  inclining: 0.25,
  movementX: 0.105,
  movementY: 0.1,
  noiseStrength: 0.375,
};

function render({ renderer, scene, camera, object }) {
  object.program.uniforms.time.value += 0.0035 * options.speedMultiplier;

  for (let i = 0; i < object.program.uniforms.uColor.value.length; i += 1) {
    const normalizedColorArray = object.program.uniforms.uColor.value[i];

    // if colors is the same do nothing
    // prettier-ignore
    if (normalizedColorArray.every((color, colorIdx) => colors[i][colorIdx] === color))
      continue;

    object.program.uniforms.uColor.value[i] = colors[i];
  }

  object.program.uniforms.uColorFreq.value[0] = options.colorFreqX;
  object.program.uniforms.uColorFreq.value[1] = options.colorFreqY;
  object.program.uniforms.tilting.value = options.tilting;
  object.program.uniforms.inclining.value = options.inclining;
  object.program.uniforms.movementX.value = options.movementX;
  object.program.uniforms.movementY.value = options.movementY;
  object.program.uniforms.noiseStrength.value = options.noiseStrength;

  renderer.render({ scene, camera });
}

function resize({ renderer, camera, object }) {
  const scrollbarWidth = getScrollbarWidth();

  renderer.setSize(window.innerWidth - scrollbarWidth, window.innerHeight);

  camera.perspective({ aspect: canvas.value.width / canvas.value.height });

  object.updateMatrix();
  camera.updateMatrix();
}

let firstChange = true;
watch(isDark, (value) => {
  if (firstChange) return (firstChange = false);

  let from;
  let to;

  if (value) {
    from = lightColors;
    to = darkColors;
  } else if (!value) {
    from = darkColors;
    to = lightColors;
  }

  // prettier-ignore
  for (let i = 0; i < from.length; i += 1)
    for (let j = 0; j < from[0].length; j += 1)
      animate({ from: from[i][j], to: to[i][j], onUpdate: (newColor) => (colors[i][j] = newColor) });
});

onMounted(() => {
  const aspect = window.innerWidth / window.innerHeight;

  colors = JSON.parse(JSON.stringify(isDark ? darkColors : lightColors));
  const clearColor = normalizeRgb(isDark ? [3, 3, 3] : [235, 235, 235]);

  const renderer = new Renderer({
    canvas: canvas.value,
    dpr: Math.min(window.devicePixelRatio, MAX_DPR),
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
  });

  const gl = renderer.gl;
  gl.clearColor(...clearColor, 1);

  const camera = new Camera(gl, { aspect });
  camera.position.set(0, 0, 0.5);

  const scene = new Transform();

  const objectSize = { width: 1.5, height: 1.5 };

  if (window.innerHeight < window.innerWidth) objectSize.width *= aspect;
  if (window.innerWidth < window.innerHeight) {
    objectSize.height *= window.innerHeight / window.innerWidth;

    const temp = options.colorFreqX;
    options.colorFreqX = options.colorFreqY * 1;
    options.colorFreqY = temp * 2.25;

    options.noiseStrength *= 1.5;
  }

  const objectGeometry = new Plane(gl, {
    ...objectSize,
    widthSegments: 300,
    heightSegments: 300,
  });
  const objectMaterial = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    transparent: false,
    cullFace: false,
    uniforms: {
      time: { value: 0.0 },
      randomSeed: { value: Math.random() * 1000 },
      uColor: { value: colors.map((color) => new Color(color)) },
      uColorFreq: { value: new Vec2(options.colorFreqX, options.colorFreqY) },
      tilting: { value: options.tilting },
      inclining: { value: options.inclining },
      movementX: { value: options.movementX },
      movementY: { value: options.movementY },
      noiseStrength: { value: options.noiseStrength },
    },
  });

  const object = new Mesh(gl, {
    geometry: objectGeometry,
    program: objectMaterial,
  });

  object.position.set(0, 0.4, 0);
  object.setParent(scene);

  const renderFunction = () => render({ scene, camera, object, renderer });
  const resizer = () => resize({ renderer, camera, object });

  resizer();

  raf.add(renderFunction);

  window.addEventListener('resize', resizer, false);

  onBeforeUnmount(() => {
    raf.remove(renderFunction);

    window.removeEventListener('resize', resizer);
  });
});
</script>

<template>
  <div>
    <canvas ref="canvas" />

    <div aria-hidden="true"></div>
  </div>
</template>

<style lang="scss">
canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;

  width: 100vw;
  height: 100vh;

  box-sizing: border-box;

  & + div {
    position: absolute;
    inset: 0;
    z-index: -1;

    background-color: var(--color-bg);
    opacity: 0.25;
  }
}
</style>
