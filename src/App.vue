<script setup>
import anime from 'animejs';

const route = useRoute();

/** @type {import('vue').ShallowRef<HTMLElement | null>} */
const pageContent = shallowRef(null);
const footer = shallowRef(null);
const background = ref(null);

const markdownRoutes = ['/p'];

/**
 * @param {HTMLElement} pageEl
 * @param {Function} done
 */
function enterPageAnim(pageEl, done) {
  anime({
    targets: [pageEl.style, footer.value.$el.style],
    duration: 1100,
    opacity: [0, 1],
    easing: 'easeOutQuad',
    complete: done,
  });
}

/**
 * @param {HTMLElement} pageEl
 * @param {Function} done
 */
function leavePageAnim(pageEl, done) {
  // NOTE: chrome do not allow to mess around with scroll
  anime({
    targets: [pageEl.style, footer.value.$el.style],
    duration: 200,
    opacity: [1, 0],
    easing: 'easeOutExpo',
    complete: done,
  });

  animateBackgroundWithRoute(route.fullPath);
}

/**
 * @param {string} route use route.fullPath
 */
function animateBackgroundWithRoute(route, initial = false) {
  const markdownPage = markdownRoutes.some((prefix) => route.includes(prefix));

  anime({
    targets: background.value.options,
    duration: initial ? 1500 : 800,
    colorStrength: [background.value.options.colorStrength, markdownPage ? 0.45 : 1],
    speedMultiplier: [background.value.options.speedMultiplier, markdownPage ? 0.35 : 1],
    easing: 'easeOutExpo',
  });
}

// TODO: scroll back to user's previous position

onMounted(() => {
  animateBackgroundWithRoute(route.fullPath, true);

  setTimeout(() => {
    enterPageAnim(pageContent.value, () => null);
  }, 300);
});

useHead({
  titleTemplate: (title) => title || 'Bogdan Kostyuk',
});
</script>

<template>
  <Background ref="background" />

  <Navbar :markdown-routes />

  <div ref="pageContent" content>
    <RouterView v-slot="{ Component }">
      <Transition mode="out-in" :css="false" @enter="enterPageAnim" @leave="leavePageAnim">
        <Component :is="Component" />
      </Transition>
    </RouterView>
  </div>

  <Footer ref="footer" />
</template>
