import Vue from 'vue'
import './plugins/vuetify'
import Firebase from './plugins/firebase'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(Firebase)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
