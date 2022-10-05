import { defineConfig } from 'vite';
import { join } from 'path';
import Vue from '@vitejs/plugin-vue';
import GLSL from 'vite-plugin-glsl';
import Pages from 'vite-plugin-pages';
import SvgLoader from 'vite-svg-loader';
import Markdown from 'vite-plugin-vue-markdown';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

import MarkdownItAnchor from 'markdown-it-anchor';
import { markdownItShikiTwoslashSetup } from 'markdown-it-shiki-twoslash';

import sequoiaMoonlight from './src/assets/themes/sequoia-moonlight.json';

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const shiki = await markdownItShikiTwoslashSetup({
    theme: sequoiaMoonlight,
    langs: ['js', 'ts', 'html', 'css', 'sh'],
  });

  return {
    plugins: [
      Vue({ include: [/\.vue$/, /\.md$/] }),

      Pages({
        extensions: ['vue', 'md'],
        dirs: [
          { dir: 'src/pages', baseRoute: '' },
          { dir: 'src/posts', baseRoute: 'p' },
        ],
      }),

      SvgLoader({ svgo: false }),

      Components({
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      }),

      AutoImport({
        imports: ['vue', 'vue-router', '@vueuse/head'],
        dirs: ['src/composables', 'src/helpers'],
        vueTemplate: true,
        dts: true,
      }),

      GLSL(),

      Markdown({
        headEnabled: true,
        wrapperClasses: false,
        wrapperComponent: false,
        markdownItOptions: { typographer: true },
        markdownItSetup: (markdownit) => {
          markdownit.use(MarkdownItAnchor, { permalink: MarkdownItAnchor.permalink.ariaHidden({ class: '', placement: 'before' }) });
          markdownit.use(shiki);
        },
      }),
    ],

    ssgOptions: { script: 'async', dirStyle: 'nested', formatting: 'minify' },

    resolve: {
      alias: {
        '~': join(__dirname, 'src'),
        '~assets': join(__dirname, 'src', 'assets'),
      },
    },
  };
});
