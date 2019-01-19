import Vue from 'vue'
import Vuex from 'vuex'
import auth from './module/auth.module'
import strava from './module/strava.module'
import request from './module/request.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    strava,
    request
  }
})
