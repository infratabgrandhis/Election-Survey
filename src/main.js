import Vue from 'vue'
import Vuetify from './plugins/vuetify'
import store from './store'
import router from './router'
import App from './App.vue'
import firebaseConfig from './config/firebase.json'
import './registerServiceWorker'

import VueFusionCharts from 'vue-fusioncharts';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  Vuetify,
  VueFusionCharts,
  FusionCharts,
  Charts,
  render: h => h(App)
}).$mount('#app');

firebase.initializeApp(firebaseConfig.initializeConfig);