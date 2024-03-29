import process from 'node:process';
import { readFileSync } from 'node:fs';
import { dirname, join, parse, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import GLSL from 'vite-plugin-glsl';
import Pages from 'vite-plugin-pages';
import SvgLoader from 'vite-svg-loader';
import Markdown from 'vite-plugin-vue-markdown';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import CloudflareHeaders from 'unplugin-cloudflare-headers/vite';

import browserslistToEsbuild from 'browserslist-to-esbuild';
import matter from 'gray-matter';
import generateSitemap from 'vite-ssg-sitemap';
import MarkdownItAnchor from 'markdown-it-anchor';
import { markdownItShikiTwoslashSetup } from 'markdown-it-shiki-twoslash';

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
      Vue({ include: [/\.vue$/, /\.md$/] }),

      Pages({
        extensions: ['vue', 'md'],
        dirs: [
          { dir: 'src/pages', baseRoute: '' },
          { dir: 'content/posts', baseRoute: 'p' },
        ],
        onRoutesGenerated(routes) {
          if (isDev) return routes;

          const newRoutes = [];

          for (const route of routes) {
            const normalizedComponentPath = route.component.slice(1);
            const componentPath = resolve(currentDir, normalizedComponentPath);
            const postContents = readFileSync(componentPath, {
              encoding: 'utf-8',
            });

            const { data, isEmpty } = matter(postContents);

            if (isEmpty) continue;

            if (!data.draft) newRoutes.push(route);
          }

          return newRoutes;
        },
        /** @param {{ name: string, path: string, component: string, props: boolean }} route */
        extendRoute(route) {
          // removing leading slash
          const normalizedComponentPath = route.component.slice(1);
          const componentPath = resolve(currentDir, normalizedComponentPath);

          const routeContent = readFileSync(componentPath);
          const { name, ext } = parse(componentPath);
          const { data: meta } = matter(routeContent);

          const info = {
            meta,
            ext,
            filename: name,
          };

          const prefixTypeMapper = { '/p': 'post' };
          for (const [prefix, type] in Object.entries(prefixTypeMapper))
            if (route.path.includes(prefix)) info.type = type;

          return { ...route, ...info };
        },
      }),

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
        compress: {
          defaults: true,
          keep_fargs: false,
          module: true,
          toplevel: true,
          unsafe_math: true,
          unsafe_symbols: true,
          unsafe_methods: true,
          unsafe_proto: true,
          unsafe_regexp: true,
          unsafe_undefined: true,
        },
        mangle: {
          toplevel: true,
        },
        toplevel: true,
        safari10: false,
        ecma: 2020,
      },
    },

    optimizeDeps: {
      include: ['animejs', '@unhead/vue'],
    },
  };
});
