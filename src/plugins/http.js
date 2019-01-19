import axios from 'axios'
import store from '../store'

const instance = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API
})

// before a request is made start the nprogress
instance.interceptors.request.use(config => {
  store.dispatch('request/requestStart')
  return config
})

// before a response is returned stop nprogress
instance.interceptors.response.use(response => {
  store.dispatch('request/requestStop')
  return response
})

export default instance
