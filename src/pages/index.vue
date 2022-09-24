<script setup>
import pages from "~pages";
</script>

<template>
  <div>
    <ul>
      <li v-for="page in pages" :key="page.path">
        <RouterLink :to="page.path">
          {{ page.name }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
