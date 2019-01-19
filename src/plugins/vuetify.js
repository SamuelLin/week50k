import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#ff9800',
    secondary: '#009688',
    accent: '#4caf50',
    error: '#f44336',
    warning: '#e91e63',
    info: '#03a9f4',
    success: '#cddc39'
  }
})
