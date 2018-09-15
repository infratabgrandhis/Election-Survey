import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import _get from 'lodash/get'
import axios from 'axios'
import config from './config/firebase.json'
import _ from 'lodash'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isBurgerbarOpen: false,
    authUser: {},
    mandalName: '',
    villageName: '',
    snackObj: {}
  },
  getters: {
    getBurgerBarStatus: state => {
      return state.isBurgerbarOpen;
    },
    getAuthData: state => {
      return state.authUser;
    },
    getMandalName: state => {
      return state.mandalName;
    },
    getVillageName: state => {
      return state.villageName;
    },
    getSnackData: state => {
      return state.snackObj;
    },
  },
  mutations: {
    manipulateBurgerbar(state, payload) {
      Vue.set(state, 'isBurgerbarOpen', payload);
    },
    setSnackbarData(state, payload) {
      Vue.set(state, 'snackObj', payload);
    },
    setAuthData(state, payload) {
      Vue.set(state, 'authUser', payload);
      if (_get(payload, 'uid')) {
        router.push('/');
      } else {
        router.push('/signin');
      }
    },
    setMandalName(state, payload) {
      Vue.set(state, 'mandalName', payload);
    },
    setVillageName(state, payload) {
      Vue.set(state, 'villageName', payload);
    }
  },
  actions: {
    toggleBurgerbar(context, payload) {
      context.commit('manipulateBurgerbar', !context.state.isBurgerbarOpen);
    },
    manipulateSnackData(context, payload) {
      context.commit('setSnackbarData', payload);
    },
    updateAuthData(context, payload) {
      firebase.auth().onAuthStateChanged(user => {
        if (_get(user, 'uid')) {
          axios.get(config.urls.users).then(result => {
            const usersList = _.values(result.data);
            const userData = _.find(usersList, {
              uid: user.uid
            });
            context.commit('setAuthData', userData);
          });
        } else {
          context.commit('setAuthData', {});
        }
      });
    },
    updateMandalName(context, payload) {
      context.commit('setMandalName', payload);
    },
    updateVillageName(context, payload) {
      context.commit('setVillageName', payload);
    },
  }
})