import { readFileSync } from 'node:fs';
import { dirname, join, parse, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import Vue from '@vitejs/plugin-vue';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import matter from 'gray-matter';
import MarkdownItAnchor from 'markdown-it-anchor';
import { markdownItShikiTwoslashSetup } from 'markdown-it-shiki-twoslash';
import AutoImport from 'unplugin-auto-import/vite';
import CloudflareHeaders from 'unplugin-cloudflare-headers/vite';
import Components from 'unplugin-vue-components/vite';
import VueRouter from 'unplugin-vue-router/vite';

import { defineConfig } from 'vite';
import GLSL from 'vite-plugin-glsl';
import Markdown from 'vite-plugin-vue-markdown';
import generateSitemap from 'vite-ssg-sitemap';
import SvgLoader from 'vite-svg-loader';

import MarkdownItLazyImages from './markdownit/lazy-images';

import sequoiaMoonlight from './src/assets/themes/sequoia-moonlight.json';

const currentDir = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const shiki = await markdownItShikiTwoslashSetup({
    theme: sequoiaMoonlight,
    langs: ['js', 'ts', 'html', 'css', 'sh'],
  });

  const isDev = (process.env.NODE_ENV || 'production') === 'development';

  return {
    plugins: [
      VueRouter({
        extensions: ['.vue', '.md'],
        routesFolder: [
          {
            src: 'src/pages',
            path: '',
            extensions: ['.vue'],
          },
          {
            src: 'content/posts',
            path: 'p/',
            extensions: ['.md'],
          },
        ],
        extendRoute(node) {
          if (!node.fullPath.startsWith('/p/'))
            return;

          const componentPath = resolve(currentDir, `content/posts/${node.path}.md`);
          const routeContent = readFileSync(componentPath);
          const { name, ext } = parse(componentPath);
          const { data } = matter(routeContent);

          node.addToMeta({
            ...data,
            ext,
            filename: name,
          });
        },

        beforeWriteFiles(rootRoute) {
          const postsRoot = rootRoute.children.find((route) => route.path === '/p');

          if (!postsRoot)
            return;

          for (const node of postsRoot.children) {
            if (node.meta.draft === true)
              node.delete();
          }
        },
      }),

      Vue({ include: [/\.vue$/, /\.md$/] }),

      SvgLoader({ svgo: false }),

      Components({
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      }),

      AutoImport({
        imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/head'],
        dirs: ['src/composables', 'src/helpers'],
        vueTemplate: true,
        dts: true,
      }),

      GLSL({ compress: !isDev }),

      Markdown({
        headEnabled: true,
        wrapperClasses: '',
        wrapperComponent: 'MarkdownOutlet',
        markdownItOptions: { typographer: true },
        markdownItSetup: (markdownit) => {
          markdownit.use(MarkdownItAnchor, {
            permalink: MarkdownItAnchor.permalink.ariaHidden({
              class: '',
              placement: 'before',
            }),
          });
          markdownit.use(shiki);
          markdownit.use(MarkdownItLazyImages);
        },
      }),

      CloudflareHeaders({
        '/*': [
          { 'X-Robots-Tag': 'all' },
          { 'X-Frame-Options': 'DENY' },
          { 'X-Content-Type-Options': 'nosniff' },
          { 'Referrer-Policy': 'no-referrer' },
          { 'Permissions-Policy': 'document-domain=()' },
        ],
      }),
    ],

    ssgOptions: {
      dirStyle: 'nested',
      formatting: 'minify',
      format: 'esm',
      script: 'defer',

      onFinished() {
        generateSitemap({
          hostname: 'https://blog.bogdankostyuk.xyz',
          robots: [{ userAgent: '*', disallow: '' }],
        });
      },
    },

    resolve: {
      alias: {
        '~': join(currentDir, 'src'),
      },
    },

    build: {
      sourcemap: false,
      assetsDir: '_vite',

      cssTarget: browserslistToEsbuild(),
      target: browserslistToEsbuild(),
      minify: 'terser',

      terserOptions: {
        compress: true,
        mangle: true,
        toplevel: true,
        safari10: false,
        ie8: false,
        ecma: 2020,
      },
    },

    optimizeDeps: {
      include: ['animejs', '@unhead/vue'],
    },
  };
});
