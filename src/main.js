import "normalize.css/normalize.css";
import "./assets/fonts/styles.css";
import "./assets/css/sakura.css";
import "./assets/css/sakura-dark.css";

import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import routes from "~pages";

export const createApp = ViteSSG(App, { routes });
