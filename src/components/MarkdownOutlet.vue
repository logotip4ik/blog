<script setup>
const props = defineProps({
  frontmatter: { type: Object, required: true, default: () => ({}) },
});

useHead({ title: `${props.frontmatter.title} | Blog` });
</script>

<template>
  <div>
    <slot />
  </div>
</template>
