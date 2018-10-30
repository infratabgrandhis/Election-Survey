import Vue from 'vue';
import Vuetify from './plugins/vuetify';
import HighCharts from './plugins/highCharts';
import {db} from './fire.js';
import store from './store';
import router from './router';
import App from './App.vue';
import Maintenance from './views/Maintenance.vue';
import './registerServiceWorker';

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  Vuetify,
  render: h => h(Maintenance),
}).$mount('#app');
