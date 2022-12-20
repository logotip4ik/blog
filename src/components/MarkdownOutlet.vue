<script setup>
defineProps({
  frontmatter: { type: Object, required: true },
});
</script>

<template>
  <div>
    <slot />
  </div>
</template>
