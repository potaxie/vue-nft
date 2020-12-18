import { createApp } from 'vue';
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import { Form } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import * as G2 from '@antv/g2';

const app = createApp(App);
app.config.globalProperties.G2 = G2;
app.use(store).use(router).use(Antd).use(Form).mount('#app')
