import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Signin from './views/Signin.vue'
import Signout from './views/Signout.vue'
import Adduser from './views/Adduser.vue'
import Survey from './views/Survey.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'home',
    component: Home
  }, {
    path: '/signin',
    name: 'signin',
    component: Signin
  }, {
    path: '/signout',
    name: 'signout',
    component: Signout
  }, {
    path: '/addUser',
    name: 'addUser',
    component: Adduser
  }, {
    path: '/survey',
    name: 'Survey',
    component: Survey
  }]
})