import 'normalize.css/normalize.css';
import '@fontsource/ibm-plex-sans';
import '~assets/fonts/styles.css';
import '~assets/styles/sakura.scss';
import '~assets/styles/code.scss';

import { ViteSSG } from 'vite-ssg';
import App from './App.vue';
import routes from '~pages';

export const createApp = ViteSSG(App, {
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition && !to.hash) return savedPosition;

    if (to.hash) return { el: to.hash, top: 75, behavior: 'smooth' };

    return { top: 0, behavior: 'smooth' };
  },
});
