import { defineConfig } from "vite";
import shiki from "shiki";
import Vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import SvgLoader from "vite-svg-loader";
import Markdown from "vite-plugin-vue-markdown";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const hl = await shiki.getHighlighter({
    theme: "vitesse-dark",
    langs: ["js", "ts", "html", "css", "sh"],
  });

  return {
    plugins: [
      Vue({ include: [/\.vue$/, /\.md$/] }),

      Pages({
        extensions: ["vue", "md"],
        dirs: [
          { dir: "src/pages", baseRoute: "" },
          { dir: "src/posts", baseRoute: "p" },
        ],
      }),

      SvgLoader({ svgo: false }),

      Components({
        extensions: ["vue", "md"],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      }),

      AutoImport({
        imports: ["vue", "vue-router", "@vueuse/head"],
        vueTemplate: true,
        dts: true,
      }),

      Markdown({
        headEnabled: true,
        wrapperClasses: false,
        wrapperComponent: false,
        markdownItOptions: {
          highlight: (code, lang) => hl.codeToHtml(code, { lang }),
        },
      }),
    ],

    ssgOptions: { script: "async" },
  };
});
