<script setup>
defineProps({
  frontmatter: { type: Object, required: true, default: () => ({}) },
});
</script>

<template>
  <div>
    <div background-overlay></div>

    <slot />
  </div>
</template>

<style lang="scss">
div[background-overlay] {
  --100vh: calc(var(--vh, 1vh) * 100);

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;

  height: var(--100vh);

  background-image: linear-gradient(to top, var(--color-bg), 0%, var(--color-bg) 2%, transparent 50%, transparent 100%);
}
</style>
