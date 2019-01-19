import Vue from 'vue'
import './plugins/vuetify'
import Firebase from './plugins/firebase'
import App from './App.vue'
import router from './router'
import store from './store'
import ApiService from './service/api.service'
import { TokenService } from './service/storage.service'

Vue.config.productionTip = false
Vue.use(Firebase)

// Set the base URL of the API
ApiService.init(process.env.VUE_APP_ROOT_API)

// If token exists set header and mount 401 interceptor
if (TokenService.getToken()) {
  ApiService.setHeader()
  ApiService.mount401Interceptor()
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
