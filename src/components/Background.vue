<script setup>
import { Camera, Color, Mesh, Plane, Program, Renderer, Transform, Vec2 } from 'ogl';

import fragmentShader from '~/assets/shaders/fragment.glsl';
import vertexShader from '~/assets/shaders/vertex.glsl';

const isDark = useDark();

/** @type {import('vue').Ref<HTMLElement | null>} */
const canvas = ref(null);
/** @type {import('vue').Ref<HTMLElement | null>} */
const overlay = ref(null);

const MAX_DPR = 2.15;

const darkColors = hexToNormalizedRgb(['#f4abc4', '#595b83', '#333456', '#060930']);
const lightColors = hexToNormalizedRgb(['#fff9ca', '#ffdeb4', '#ffb4b4', '#b2a4ff']);

let colors = lightColors;

const options = {
  speedMultiplier: 0,
  colorFreqX: 1.4,
  colorFreqY: 1.3,
  colorStrength: 0,
  clearColor: [34, 34, 34],
  tilting: 1.5,
  inclining: 0.25,
  movementX: 0.105,
  movementY: 0.1,
  noiseStrength: 0.375,
};

function render({ renderer, scene, camera, object }) {
  object.program.uniforms.time.value += 0.0035 * options.speedMultiplier;

  for (let i = 0; i < object.program.uniforms.uColor.value.length; i += 1)
    object.program.uniforms.uColor.value[i] = colors[i];

  object.program.uniforms.uClearColor.value = options.clearColor;
  object.program.uniforms.uColorStrength.value = options.colorStrength;
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

  document.documentElement.style.setProperty('--vh', window.innerHeight / 100);
}

defineExpose({ canvas, overlay, options });

watch(isDark, (isDark) => {
  // TODO: animate transition of color scheme
  colors = isDark ? darkColors : lightColors;

  // clear color
  options.clearColor = normalizeRgb(isDark ? [34, 34, 34] : [255, 255, 255]);
});

onMounted(() => {
  const aspect = window.innerWidth / window.innerHeight;

  colors = isDark.value ? darkColors : lightColors;
  options.clearColor = normalizeRgb(isDark.value ? [34, 34, 34] : [255, 255, 255]);

  const renderer = new Renderer({
    canvas: canvas.value,
    dpr: Math.min(window.devicePixelRatio, MAX_DPR),
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
  });

  const gl = renderer.gl;
  gl.clearColor(...options.clearColor, 1);

  const camera = new Camera(gl, { aspect });
  camera.position.set(0, 0, 0.5);

  const scene = new Transform();

  const objectSize = { width: 1.5, height: 1.5 };

  if (window.innerHeight < window.innerWidth)
    objectSize.width *= aspect;
  if (window.innerWidth < window.innerHeight) {
    objectSize.height *= window.innerHeight / window.innerWidth;

    const temp = options.colorFreqX;
    options.colorFreqX = options.colorFreqY;
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
      randomSeed: { value: Math.random() % 100000 },
      uColor: { value: colors.map((color) => new Color(color)) },
      uClearColor: { value: options.clearColor },
      uColorStrength: { value: options.colorStrength },
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

  const { pause } = useRafFn(renderFunction);

  window.addEventListener('resize', resizer, false);

  onBeforeUnmount(() => {
    pause();

    window.removeEventListener('resize', resizer, false);
  });
});
</script>

<template>
  <canvas ref="canvas" />
</template>

<style lang="scss">
canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;

  width: calc(100vw - 20px);
  height: 100vh;

  box-sizing: border-box;
  background-color: white;

  @media (prefers-color-scheme: dark) {
    background-color: black;
  }
}
</style>
