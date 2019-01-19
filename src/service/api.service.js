import axios from 'axios'
import { TokenService } from './storage.service'
import store from '../store'

const ApiService = {
  // Stores the 401 interceptor position so that it can be later ejected when needed
  _401interceptor: null,

  init (baseURL) {
    axios.defaults.baseURL = baseURL
  },

  setHeader () {
    axios.defaults.headers.common['Authorization'] = `Bearer ${TokenService.getToken()}`
  },

  removeHeader () {
    axios.defaults.headers.common = {}
  },

  get (resource, params) {
    return axios.get(resource, { params })
  },

  post (resource, data) {
    return axios.post(resource, data)
  },

  put (resource, data) {
    return axios.put(resource, data)
  },

  delete (resource) {
    return axios.delete(resource)
  },

  mount401Interceptor () {
    this._401interceptor = axios.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        if (error.request.status === 401) {
          if (error.config.url.includes('/oauth/token')) {
            // Refresh token has failed. Logout the user
            store.dispatch('auth/logout')

            throw error
          } else {
            // Refresh the access token
            try {
              await store.dispatch('auth/refreshToken')

              // Retry the original request
              return this.customRequest({
                method: error.config.method,
                url: error.config.url,
                data: error.config.data,
                params: error.config.params
              })
            } catch (e) {
              // Refresh has failed - reject the original request
              throw error
            }
          }
        }

        // If error was not 401 just reject as is
        throw error
      }
    )
  },

  unmount401Interceptor () {
    // Eject the interceptor
    axios.interceptors.response.eject(this._401interceptor)
  },

  /**
   * Perform a custom Axios request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   **/
  customRequest (data) {
    return axios(data)
  }
}

export default ApiService
