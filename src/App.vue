<script setup>
import { animate } from 'popmotion';

const route = useRoute();

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
    elapsed: shouldScrollToTop ? -600 : 0,
    from: 1,
    to: 0,
    onUpdate: (opacity) => Object.assign(pageEl.style, { opacity }),
    onComplete: () => done(),
  });
}
</script>

<template>
  <Background ref="background" />

  <Navbar />

  <div ref="pageContent" content style="opacity: 0">
    <RouterView v-slot="{ Component }">
      <Transition :css="false" @enter="enterPageAnim" @leave="leavePageAnim" mode="out-in">
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
