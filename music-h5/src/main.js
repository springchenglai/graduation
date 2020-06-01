// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import { Toast } from 'vant';
import './lib/px2rem';
import App from './App';
import router from './router';
import Api from './lib/api';
import common from './lib/commonData';
import global from './lib/global';
import globalComponent from './lib/globalComponent';
import './assets/IconFont/iconfont.css';

Vue.config.productionTip = process.env.NODE_ENV === 'production';
Vue.use(Toast);
Vue.use(globalComponent);
Vue.prototype.$api = Api;
Vue.prototype.$common = common;
Vue.prototype.$global = global;
const eventBus = new Vue();
export default eventBus;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
