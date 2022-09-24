<script setup>
import ArrowBack from "../assets/icons/arrow-back.svg?component";

const backButton = ref(null);
const route = useRoute();

const showBackArrow = computed(() => {
  const allowedPrefix = ["p/"];

  return allowedPrefix.some((prefix) => route.fullPath.includes(prefix));
});

function backButtonScrollAnimation() {
  let prevScroll = 0;

  return () => {
    let direction = 1;

    if (window.scrollY < prevScroll) direction = -1;

    prevScroll = window.scrollY;

    if (!backButton.value) return;

    if (direction > 0) backButton.value.setAttribute("hidden", true);
    if (direction < 0) backButton.value.removeAttribute("hidden");
  };
}

onMounted(() => {
  const scrollListener = backButtonScrollAnimation();

  window.addEventListener("scroll", scrollListener, { passive: true });

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", scrollListener);
  });
});
</script>

<template>
  <nav>
    <transition name="fade">
      <button
        v-if="showBackArrow"
        ref="backButton"
        arrow-back
        @click="$router.back()"
      >
        <ArrowBack />
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
      display: inline-flex;
      justify-content: center;
      align-items: center;

      padding: 3rem;
      margin-left: auto;

      color: #222222;

      border-radius: 50%;

      transition: background-color 0.3s var(--ease-out),
        color 0.3s var(--ease-out), opacity 0.3s var(--ease-out);

      svg {
        display: block;

        width: 5rem;
        height: auto;
      }

      @media (prefers-color-scheme: dark) {
        color: #c9c9c9;
      }
    }

    &[hidden] {
      opacity: 0;
      pointer-events: none;

      transition-duration: 0.1s;
    }
  }
}
</style>
