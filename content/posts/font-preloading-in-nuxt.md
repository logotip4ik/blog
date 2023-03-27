---
title: Font preloading in Nuxt
description: Preload fonts or use fontaine module to reduce CLS
date: 2023/03/27
tags:
  - fonts
  - nuxt3
---

# Font preloading

To preload font you need a link from which browser will start preloading. Nuxt uses vite under the hood,
so we can utilize its import prefixes to gather correct import link.

```js
import SomeFont from '~/assets/fonts/some-font.woff2?url';
```

At dev environment vite will return something like this: ``/src/assets/fonts/some-font.woff2``, but at build time,
it will add build hash to filename and put it in assets folder, it will look something like this: ``/_nuxt/some-font.6bde7bbf.woff2``

## Create correct link tag

The easiest way to add tags to head in nuxt is to use `useHead` composable. But it also will add some js to the client bundle. And current workaround is to wrap it into some static statement which rollup will delete. For this reason we will use `process.server`. One catch here is that fonts requires cors to start preloading

> Note: font and fetch preloading requires the crossorigin attribute to be set; see CORS-enabled fetches below.
> _[- Quote from mdn](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload)_

Sooooooo, the link tag should look something like this:

```html
<link rel="preload" href="link-to-some-font" crossorigin="" as="font" type="font/woff2" />
```

Moving this to `useHead` will result in:

```js
useHead({
  link: [
    {
      rel: 'preload',
      href: 'link-to-some-font',
      crossorigin: '',
      as: 'font',
      type: 'font/woff2',
    }
  ]
})
```

## Usage ?

I prefer to put this preloading link into main file of the app, in nuxt app.vue (nuxt.config.ts does not support `~` aliases as well as import prefixes). Then wrap it in `process.server` and put in correct font link. So the result will look something like this:

```html title="app.vue"
<script setup lang="ts">
import SomeFontUrl from '~/assets/fonts/some-font.woff2?url'

if (process.server) {
  useHead({
    link: [
      {
        rel: 'preload',
        href: SomeFontUrl,
        crossorigin: '',
        as: 'font',
        type: 'font/woff2',
      }
    ]
  })
}
</script>
```

## CLS Bonus

Too reduce CLS in pagespeed [@danielroe](https://github.com/danielroe) created great package called [fontaine](https://github.com/nuxt-modules/fontaine). And of course there are nuxt module to integrate it into nuxt app - [@nuxtjs/fontaine](https://github.com/nuxt-modules/fontaine)

If it works correctly, you should see in _head_ of your html page, style tag with something like this:

```html
<style>
@font-face {
  font-family: "Some font override";
  src: local("BlinkMacSystemFont"),
    local("Segoe UI"),
    local("Roboto"),
    local("Helvetica Neue"),
    local("Arial"),
    local("Noto Sans");
  ascent-override: 80%;
  descent-override: 16.7%;
  line-gap-override: 0%;
}
</style>
```

But if there are an empty style tag, that means that you should add hint for fontaine to create fallback fonts.

```js
export default defineNuxtConfig({
  // ... config
  modules: [
    '@nuxtjs/fontaine',
    // ... more modules
  ],
  
  // ... even more config

  fontMetrics: {
    fonts: [
      // in my case src was relative to public folder
      { family: 'Some font', src: '/fonts/some-font.woff2' },
    ],
  },
})
```

Hope it helps 👍    
see you soon, i guess...
