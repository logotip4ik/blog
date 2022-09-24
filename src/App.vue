<script setup>
const router = useRouter();

// router.s
</script>

<template>
  <Navbar />

  <Transition name="page">
    <router-view />
  </Transition>
</template>

<style>
:root {
  --ease-out: cubic-bezier(0.33, 1, 0.68, 1);
}

body {
  padding-top: 12rem;

  overflow-y: scroll;
}

pre,
code,
blockquote {
  border-radius: 0.175rem;
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
