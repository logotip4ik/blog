<script setup></script>

<template>
  <Background />

  <Navbar />

  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <Component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style lang="scss">
:root {
  --ease-out: cubic-bezier(0.33, 1, 0.68, 1);
}

body {
  padding-top: 35vh;

  overflow-y: scroll;
}

pre,
code,
blockquote {
  border-radius: 0.2rem;

  box-shadow: 0 0 0.25rem rgba($color: #000, $alpha: 0.075);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s var(--ease-out);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
