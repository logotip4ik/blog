<script setup>
import pages from '~pages';

const posts = computed(() => pages.filter((page) => page.path.includes('/p')));

useHead({
  title: 'blog',
});
</script>

<template>
  <div index-page>
    <h1>Blog</h1>

    <p>This is a place to put some of my thoughts, share code snippets and improve my skills as developer. Enjoy 😁</p>

    <ul>
      <li v-for="page in posts" :key="page.path">
        <RouterLink :to="page.path">
          {{ filenameToRouteName(page.filename) }}
        </RouterLink>

        <span>&nbsp;{{ formatDate(page.createAt) }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
div[index-page] {
  h1 + p {
    margin-bottom: 5rem;
  }

  li > span {
    float: right;
  }
}
</style>
