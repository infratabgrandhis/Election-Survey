import Vue from 'vue'
import Vuetify from './plugins/vuetify'
import store from './store'
import router from './router'
import App from './App.vue'
import firebaseConfig from './config/firebase.json'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  Vuetify,
  render: h => h(App)
}).$mount('#app');

firebase.initializeApp(firebaseConfig.initializeConfig);