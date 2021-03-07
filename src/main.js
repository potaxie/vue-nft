import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import { Form } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import enUS from '@kangc/v-md-editor/lib/lang/en-US';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import i18n from './i18n'
VMdEditor.use(githubTheme);
VMdEditor.lang.use('en-US', enUS);

const app = createApp(App).use(i18n);
app.use(store)
  .use(router)
  .use(Antd)
  .use(Form)
  .use(VMdEditor)
  .mount("#app");
