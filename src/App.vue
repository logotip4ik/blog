<script setup>
import { animate } from 'popmotion';

const route = useRoute();

const { isDark } = useDarkMode();

/** @type {import('vue').Ref<HTMLElement | null>} */
const backgroundOverlay = ref(null);
/** @type {import('vue').Ref<HTMLElement | null>} */
const pageContent = ref(null);
const background = ref(null);

/**
 * @param {HTMLElement} pageEl
 * @param {function} done
 */
function enterPageAnim(pageEl, done) {
  // fix from initially blinking content because onUpdate gives not zero value at the beginning
  Object.assign(pageEl.style, { opacity: 0 });

  animate({
    from: 0,
    to: 1,
    onUpdate: (opacity) => Object.assign(pageEl.style, { opacity }),
    onComplete: () => done(),
  });
}

/**
 * @param {HTMLElement} pageEl
 * @param {function} done
 */
function leavePageAnim(pageEl, done) {
  const shouldScrollToTop = window.scrollY !== 0;

  if (shouldScrollToTop) {
    animate({
      from: window.scrollY,
      to: 0,
      duration: 500,
      onUpdate: (scrollTop) => Object.assign(document.documentElement, { scrollTop }),
    });
  }

  animate({
    elapsed: shouldScrollToTop ? -700 : 0,
    from: 1,
    to: 0,
    onUpdate: (opacity) => Object.assign(pageEl.style, { opacity }),
    onComplete: () => done(),
  });
}

/**
 * @param {string} route
 * @returns {Promise<void>}
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

watch(() => route.fullPath, animateBackgroundWithRoute);

onMounted(() => {
  animateBackgroundWithRoute(route.fullPath);

  setTimeout(() => enterPageAnim(pageContent.value, () => null), 300);
});
</script>

<template>
  <Background ref="background" />

  <Navbar />

  <div ref="pageContent" content style="opacity: 0">
    <RouterView v-slot="{ Component }">
      <Transition mode="out-in" :css="false" @enter="enterPageAnim" @leave="leavePageAnim">
        <KeepAlive>
          <Component :is="Component" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </div>
</template>

<style lang="scss">
:root {
  --ease-out: cubic-bezier(0.33, 1, 0.68, 1);
}

body {
  padding-top: 35vh;

  overflow-y: scroll;
}

pre,
code,
blockquote {
  border-radius: 0.2rem;

  box-shadow: 0 0 0.25rem rgba($color: #000, $alpha: 0.075);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
