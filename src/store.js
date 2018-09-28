import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";
import _get from "lodash/get";
import _ from "lodash";
import { db } from "@/fire.js";
import util from '@/util/util.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isBurgerbarOpen: false,
    authUser: {},
    mandalName: "",
    mandalAliasName: "",
    villageName: "",
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
    getMandalAliasName: state => {
      return state.mandalAliasName;
    },
    getVillageName: state => {
      return state.villageName;
    },
    getSnackData: state => {
      return state.snackObj;
    }
  },
  mutations: {
    manipulateBurgerbar(state, payload) {
      Vue.set(state, "isBurgerbarOpen", payload);
    },
    setSnackbarData(state, payload) {
      Vue.set(state, "snackObj", payload);
    },
    setAuthData(state, payload) {
      Vue.set(state, "authUser", payload);
      if (_get(payload, "uid")) {
        router.push("/");
      } else {
        router.push("/signin");
      }
    },
    setMandalName(state, payload) {
      Vue.set(state, "mandalName", payload);
    },
    setMandalAliasName(state, payload) {
      Vue.set(state, "mandalAliasName", payload);
    },
    setVillageName(state, payload) {
      Vue.set(state, "villageName", payload);
    }
  },
  actions: {
    toggleBurgerbar(context, payload) {
      context.commit("manipulateBurgerbar", !context.state.isBurgerbarOpen);
    },
    manipulateSnackData(context, payload) {
      context.commit("setSnackbarData", payload);
    },
    updateAuthData(context, payload) {
      firebase.auth().onAuthStateChanged(user => {
        if (_get(user, "uid")) {
          db.collection("Employees")
            .where("uid", "==", user.uid)
            .get()
            .then(result => {
              context.commit("setAuthData", util.firebaseGetValidator(result));
            })
            .catch(err => {
              context.commit("setAuthData", {});
            });
        } else {
          context.commit("setAuthData", {});
        }
      });
    },
    updateMandalName(context, payload) {
      context.commit("setMandalName", payload);
    },
    updateMandalAliasName(context, payload) {
      context.commit("setMandalAliasName", payload);
    },
    updateVillageName(context, payload) {
      context.commit("setVillageName", payload);
    }
  }
});
