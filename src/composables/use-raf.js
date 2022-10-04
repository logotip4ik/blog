import { onMounted } from 'vue';

const callbacks = new Map();

let animationFrame;

export default function () {
  if (!animationFrame) onMounted(createAnimationFrame);

  return {
    add: (value) => callbacks.set(value, value),
    remove: (value) => callbacks.delete(value),
  };
}

function createAnimationFrame() {
  const loop = (time) => {
    callbacks.forEach((value) => typeof value === 'function' && value(time));

    requestAnimationFrame(loop);
  };

  animationFrame = requestAnimationFrame(loop);

  window.addEventListener('beforeunload', () => cancelAnimationFrame(animationFrame));
}
