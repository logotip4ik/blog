<script setup>
import { animate } from 'popmotion';

const route = useRoute();

const isDark = useDark({ valueDark: '' });

/** @type {import('vue').Ref<HTMLElement | null>} */
const pageContent = ref(null);
const background = ref(null);
const footer = ref(null);

/**
 * @param {HTMLElement} pageEl
 * @param {function} done
 */
function enterPageAnim(pageEl, done) {
  // fix from initially blinking content because onUpdate gives not zero value at the beginning
  Object.assign(pageEl.style, { opacity: 0 });
  Object.assign(footer.value.$el.style, { opacity: 0 });

  animate({
    from: 0,
    to: 1,
    onUpdate: (opacity) => {
      Object.assign(pageEl.style, { opacity });
      Object.assign(footer.value.$el.style, { opacity });
    },
    onComplete: () => done(),
  });
}

/**
 * @param {HTMLElement} pageEl
 * @param {function} done
 */
function leavePageAnim(pageEl, done) {
  const animateScroll = (from = window.scrollY, to = 0) => new Promise((resolve) => {
    if (window.scrollY === to) return resolve();

    animate({
      from,
      to,
      duration: 500,
      restSpeed: 0,
      restDelta: 0.01,
      onUpdate: (scrollTop) => Object.assign(window, { scrollTop }),
      onComplete: () => resolve(),
    });
  });

  animateScroll().then(() => {
    animate({
      from: 1,
      to: 0,
      onUpdate: (opacity) => {
        Object.assign(pageEl.style, { opacity });
        Object.assign(footer.value.$el.style, { opacity });
      },
      onComplete: () => done(),
    });

    animateBackgroundWithRoute(route.fullPath);
  });
}

/**
 * @param {string} route use route.fullPath
 */
function animateBackgroundWithRoute(route) {
  const prefixes = ['/p'];

  const dimmed = isDark.value ? 0.45 : 0.45;
  const markdownPage = prefixes.some((prefix) => route.includes(prefix));

  animate({
    from: background.value.options.colorStrength || 0,
    to: markdownPage ? dimmed : 1,
    onUpdate: (colorStrength) => Object.assign(background.value.options, { colorStrength }),
  });

  animate({
    from: background.value.options.speedMultiplier || 1,
    to: markdownPage ? 0.35 : 1,
    onUpdate: (speedMultiplier) => Object.assign(background.value.options, { speedMultiplier }),
  });
}

useHead({
  titleTemplate: (title) => !title ? 'Blog' : `${title} | Blog`,
});

// TODO: scroll back to user's previous position

onMounted(() => {
  animateBackgroundWithRoute(route.fullPath);

  setTimeout(() => enterPageAnim(pageContent.value, () => null), 300);
});
</script>

<template>
  <Background ref="background" />

  <Navbar />

  <div ref="pageContent" content>
    <RouterView v-slot="{ Component }">
      <Transition mode="out-in" :css="false" @enter="enterPageAnim" @leave="leavePageAnim">
        <Component :is="Component" />
      </Transition>
    </RouterView>
  </div>

  <Footer ref="footer" />
</template>
