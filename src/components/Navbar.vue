<script setup>
const props = defineProps({
  markdownRoutes: {
    /** @type {import('vue').PropType<string[]>} */
    type: Array,
    required: true,
  },
})
const backButton = ref(null);
const route = useRoute();

const showBackArrow = computed(() =>
  props.markdownRoutes.some((prefix) => route.fullPath.includes(prefix))
);

let prevScroll = 0;
function backButtonScrollAnimation() {
  let direction = 1;

  if (window.scrollY < prevScroll) direction = -1;

  prevScroll = window.scrollY;

  if (!backButton.value) return;

  if (direction > 0) backButton.value.setAttribute('data-hidden', true);
  if (direction < 0) backButton.value.removeAttribute('data-hidden');
}

onMounted(() => {
  const scrollHandlerOptions = { passive: true };

  window.addEventListener('scroll', backButtonScrollAnimation, scrollHandlerOptions);

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', backButtonScrollAnimation, scrollHandlerOptions);
  });
});
</script>

<template>
  <nav>
    <transition name="fade">
      <button v-if="showBackArrow" ref="backButton" arrow-back @click="$router.back()">
        go back
      </button>
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
      font-weight: 600;
      color: white;

      border: 1px solid transparent;
      border-radius: 0.2rem;

      transition: border-color 0.3s var(--ease-out), opacity 0.3s var(--ease-out);

      &:is(:focus-visible, :hover) {
        color: white;
        border-color: currentColor;

        background: none;
      }

      @media print {
        display: none;
      }
    }

    &[data-hidden] {
      opacity: 0;

      transition-duration: 0.1s;

      // even if button is hidden from eyes, still show on tabbing through the page
      &:is(:focus-visible, :hover) {
        opacity: 1;
      }
    }
  }
}
</style>
