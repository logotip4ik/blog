import { onMounted } from 'vue';

/**
 * @typedef Callback
 * @type {object}
 * @property {number} id
 * @property {function} value
 */

/** @type {Callback[]} */
const callbacks = [];

let animationFrame;

export default function () {
  if (!animationFrame) onMounted(createAnimationFrame);

  return {
    add: (value) => {
      /** @type {Callback} */
      const callback = { id: getId(), value };

      callbacks.push(callback);

      return callback.id;
    },

    remove: (id) => {
      const index = callbacks.findIndex((callback) => callback.id === id);

      callbacks.splice(index, 1);
    },
  };
}

/** @return {number} */
function getId() {
  if (typeof window !== 'undefined') return Math.random();

  return performance.now();
}

function createAnimationFrame() {
  const raf = window.requestAnimationFrame;

  const loop = (time) => {
    raf(loop);

    callbacks.forEach((callback) => {
      if (typeof callback.value !== 'function') return;

      callback.value(time);
    });
  };

  animationFrame = raf(loop);

  window.addEventListener('beforeunload', () => cancelAnimationFrame(animationFrame));
}
