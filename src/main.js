import 'normalize.css/normalize.css';
import '@fontsource/ibm-plex-sans/latin.css';
import '~/assets/fonts/styles.css';
import '~/assets/styles/sakura.scss';
import '~/assets/styles/code.scss';

import { ViteSSG } from 'vite-ssg';
import { routes } from 'vue-router/auto-routes';
import App from './App.vue';

export const createApp = ViteSSG(App, {
  routes,
  scrollBehavior: (to, _from, savedPosition) => {
    if (savedPosition && !to.hash) return savedPosition;

    if (to.hash) return { el: to.hash, top: 75, behavior: 'smooth' };

    return { top: 0, behavior: 'smooth' };
  },
});
