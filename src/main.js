import Vue from 'vue'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import Vuetify from 'vuetify';

import App from './App.vue'
import { routes } from './routes';
import store from './store/store';

import * as firebaseui from 'firebaseui';
import vuetify from './plugins/vuetify';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuetify);

Vue.http.options.root = 'https://vuejs-stock-trader-f7694.firebaseio.com/';

Vue.filter('currency', (value) => {
  return '$' + value.toLocaleString();
})

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  render: h => h(App)
})
