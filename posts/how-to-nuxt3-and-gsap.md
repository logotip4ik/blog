---
title: How to combine GSAP and Nuxt3
description: Little tutorial on how to implement gsap into nuxt3
date: 2022/09/23
tags:
  - gsap
  - nuxt3
---

# How to combine GSAP and Nuxt3

This started from my personal portfolio and person asked how I implemented GSAP into Nuxt3, and now I am writing a blog post on it :)

> [You can checkout main discussion answer at github](https://github.com/logotip4ik/portfolio/discussions/94)

## Transpiling gsap

So we will assume that you have working nuxt3 website and installed gsap (latest version recommended). First of all you need tell nuxt to transpile gsap so you can import it without getting some errors. Nuxt3 has compatible with Nuxt2 configuration, so we will just add this:

```javascript
// ~/nuxt.config.js

// you can omit this line in nuxt3 rc.10+
import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  // ...some configuration

  build: {
    transpile: ['gsap'],
  },

  // ...even more configuration
});
```

into our `nuxt.config.[js|ts]`

## Registering GSAP and its plugins in Nuxt

We need to import gsap and register plugins as soon as possible, before every component or page, in order to correctly use it. I found a pretty straightforward solution - use Nuxt plugins. To do so we will create with a file with name `gsap.js` (example) in `plugins` directory (you may need to create it). This file will do be executed on server as well as on client side and it is totally ok, cuz we are transpiling gsap.

```javascript
// ~/plugins/gsap.js

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// nuxt will auto import defineNuxtPlugin, so our file will look clean
export default defineNuxtPlugin(() => {
  // imported gsap and all plugins needed, then just register them
  gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

  // later you can use them by deconstructing useNuxtApp composable
  // but everything you put in provide will be prefixed with `$` symbol to
  // prevent some collisions
  return { provide: { gsap, ScrollToPlugin, ScrollTrigger } };
});
```

## Using in components or pages

At this point gsap is imported, plugins are registered, so you can use it as is. But to make code more readable and elegant, we will create the gsap composable that will be auto imported in every vue component. Touch a new file `use-gsap.js` in `composables` directory, and put some similar code to this:

```javascript
// ~/composables/use-gsap.js

export default () => {
  // auto imported by nuxt
  const nuxtApp = useNuxtApp();

  return {
    // this coming from gsap plugin, which will be also auto registered
    gsap: nuxtApp.$gsap,
    ScrollTrigger: nuxtApp.$ScrollTrigger,
    ScrollToPlugin: nuxtApp.$ScrollToPlugin,
  };
};
```

And then in every page or component you can do:

```html
<script setup>
  // name of composable is the file name, just remove `-` and camelCase it
  const { gsap, ScrollTrigger, ScrollToPlugin } = useGsap();

  // or, if you omitted creation of your own composable you still
  // can use gsap and everything else through useNuxtApp
  const { $gsap, $ScrollTrigger, $ScrollToPlugin } = useNuxtApp();

  const box = ref(null);

  onMounted(() => {
    gsap.from(box.value, {
      y: -100,
      opacity: 0,
      ease: 'expo.out',
      duration: 1,
    });
  });
</script>

<template>
  <div class="container">
    <div ref="box" class="container__box">i am a box</div>
  </div>
</template>
```

Hope it helps and see you in next posts 🖐
