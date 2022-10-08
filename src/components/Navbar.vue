<script setup>
const backButton = ref(null);
const route = useRoute();

const showBackArrow = computed(() => {
  const allowedPrefix = ['p/'];

  return allowedPrefix.some((prefix) => route.fullPath.includes(prefix));
});

function backButtonScrollAnimation() {
  let prevScroll = 0;

  return () => {
    let direction = 1;

    if (window.scrollY < prevScroll) direction = -1;

    prevScroll = window.scrollY;

    if (!backButton.value) return;

    if (direction > 0) backButton.value.setAttribute('data-hidden', true);
    if (direction < 0) backButton.value.removeAttribute('data-hidden');
  };
}

onMounted(() => {
  const scrollListener = backButtonScrollAnimation();

  window.addEventListener('scroll', scrollListener, { passive: true });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', scrollListener);
  });
});
</script>

<template>
  <nav>
    <transition name="fade">
      <button v-if="showBackArrow" ref="backButton" arrow-back @click="$router.back()">go back</button>
    </transition>
  </nav>
</template>

<style lang="scss">
nav {
  display: flex;
  justify-content: space-between;

  position: fixed;
  top: 0;
  left: 50%;
  z-index: 10;

  width: calc(100% - 13px);
  max-width: 38em;

  padding-block: 1.25rem 0;

  pointer-events: none;
  transform: translateX(-50%);

  mix-blend-mode: exclusion;

  button {
    --ease-out: cubic-bezier(0.33, 1, 0.68, 1);

    background: none;

    pointer-events: all;

    &[arrow-back] {
      padding: 3rem;
      margin-left: auto;

      font-family: var(--font-family-heading);
      font-size: 2rem;
      color: white;

      border: 1px solid transparent;
      border-radius: 0.2rem;

      transition: border-color 0.3s var(--ease-out), opacity 0.3s var(--ease-out);

      &:is(:focus-visible, :hover) {
        color: white;
        border-color: currentColor;

        background: transparent;
      }

      @media print {
        display: none;
      }
    }

    &[data-hidden] {
      opacity: 0;

      transition-duration: 0.1s;

      // even if button is hidden from eyes, still show on tabbing through the page
      &:focus-visible {
        opacity: 1;
      }
    }
  }
}
</style>
