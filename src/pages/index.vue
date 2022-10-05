<script setup>
import pages from '~pages';

const posts = computed(() => pages.filter((page) => page.path.includes('/p')));

useHead({
  title: 'blog',
});
</script>

<template>
  <div>
    <ul>
      <li v-for="page in posts" :key="page.path">
        <RouterLink :to="page.path">
          {{ page.name }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
