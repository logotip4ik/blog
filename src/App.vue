<script setup>
import anime from 'animejs';

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
  anime({
    targets: [pageEl.style, footer.value.$el.style],
    duration: 400,
    opacity: [0, 1],
    easing: 'easeOutQuad',
    complete: done,
  });
}

/**
 * @param {HTMLElement} pageEl
 * @param {function} done
 */
function leavePageAnim(pageEl, done) {
  // NOTE: chrome do not allow to mess around with scroll
  anime({
    targets: [pageEl.style, footer.value.$el.style],
    duration: 400,
    opacity: [1, 0],
    easing: 'easeOutExpo',
    complete: done,
  });

  animateBackgroundWithRoute(route.fullPath);
}

/**
 * @param {string} route use route.fullPath
 */
function animateBackgroundWithRoute(route) {
  const prefixes = ['/p'];

  const dimmed = isDark.value ? 0.45 : 0.45;
  const markdownPage = prefixes.some((prefix) => route.includes(prefix));

  anime({
    targets: background.value.options,
    duration: 500,
    colorStrength: [background.value.options.colorStrength || 0, markdownPage ? dimmed : 1],
    easing: 'easeOutQuad',
  });

  anime({
    targets: background.value.options,
    duration: 500,
    speedMultiplier: [background.value.options.speedMultiplier || 1, markdownPage ? 0.35 : 1],
    easing: 'easeOutQuad',
  });
}

useHead({ titleTemplate: (title) => !title ? 'Blog' : `${title} | Blog` });

// TODO: scroll back to user's previous position

onMounted(() => {
  animateBackgroundWithRoute(route.fullPath);

  setTimeout(() => enterPageAnim(pageContent.value, () => null), 300);

  window.$anime = anime;
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
