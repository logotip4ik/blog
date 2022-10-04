<script setup>
import { animate } from 'popmotion';

const route = useRoute();

/** @type {import('vue').Ref<HTMLElement | null>} */
const backgroundOverlay = ref(null);
/** @type {import('vue').Ref<HTMLElement | null>} */
const pageContent = ref(null);

function animateBackgroundOverlayWithRoute(routeString) {
  if (!backgroundOverlay.value) backgroundOverlay.value = document.querySelector('canvas + div');

  const allowedPrefix = ['p-'];
  let from;
  let to;

  if (allowedPrefix.some((prefix) => routeString.includes(prefix))) {
    from = backgroundOverlay.value.style.opacity || 1;
    to = 1;
  } else {
    from = backgroundOverlay.value.style.opacity || 1;
    to = 0;
  }

  animate({
    from,
    to,
    duration: 750,
    onUpdate: (opacity) => Object.assign(backgroundOverlay.value.style, { opacity }),
  });
}

function enterPageAnim(pageEl, done) {
  animate({ from: 0, to: 1, onUpdate: (opacity) => Object.assign(pageEl.style, { opacity }), onComplete: () => done() });
}

function leavePageAnim(pageEl, done) {
  animate({
    from: window.scrollY,
    to: 0,
    duration: window.scrollY !== 0 ? 500 : 0,
    onUpdate: (scrollTop) => Object.assign(document.documentElement, { scrollTop }),
    onComplete: () => animateBackgroundOverlayWithRoute(route.name),
  });

  animate({
    elapsed: window.scrollY !== 0 ? -500 : 0,
    from: 1,
    to: 0,
    onUpdate: (opacity) => Object.assign(pageEl.style, { opacity }),
    onComplete: () => done(),
  });
}

onMounted(() => {
  animateBackgroundOverlayWithRoute(route.name);
});
</script>

<template>
  <Background />

  <Navbar />

  <div ref="pageContent" content>
    <RouterView v-slot="{ Component }">
      <Transition @enter="enterPageAnim" @leave="leavePageAnim" mode="out-in">
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
  // padding-left: 1.25rem;

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

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s var(--ease-out);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
