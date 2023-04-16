<script setup>
import pages from '~pages';

const posts = computed(() =>
  pages
    .filter((page) => page.path.includes('/p'))
    .sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date))
);

useHead({ title: '' });
</script>

<template>
  <div index-page>
    <header>
      <h1>Blog</h1>

      <a
        href="https://github.com/logotip4ik"
        target="_blank"
        rel="noopener noreferrer"
      >
        gh
      </a>
    </header>

    <p>
      This is a place to put some of my thoughts, share code snippets and
      improve my skills as developer. Enjoy 😁
    </p>

    <ul>
      <li v-for="page in posts" :key="page.path">
        <RouterLink :to="page.path">
          {{ page.meta.title }}
        </RouterLink>

        <br>

        <small>{{ formatDate(new Date(page.meta.date)) }}</small>

        <small v-if="page.meta.tags && page.meta.tags.length !== 0">
          |
          <template v-for="(tag, key) in page.meta.tags" :key="key">
            #{{ tag }}
          </template>
        </small>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
div[index-page] {
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  header + p {
    margin-bottom: 4rem;
  }

  li {
    &::marker {
      color: var(--color-blossom);
    }

    & > small {
      margin-bottom: 1rem;

      opacity: 0.5;
    }
  }
}
</style>
