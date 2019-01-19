import http from '../plugins/http'
import { TokenService } from './storage.service'
import store from '../store'

const ApiService = {
  // Stores the 401 interceptor position so that it can be later ejected when needed
  _401interceptor: null,

  init (baseURL) {
    http.defaults.baseURL = baseURL
  },

  setHeader () {
    http.defaults.headers.common['Authorization'] = `Bearer ${TokenService.getToken()}`
  },

  removeHeader () {
    http.defaults.headers.common = {}
  },

  get (resource, params) {
    return http.get(resource, { params })
  },

  post (resource, data) {
    return http.post(resource, data)
  },

  put (resource, data) {
    return http.put(resource, data)
  },

  delete (resource) {
    return http.delete(resource)
  },

  mount401Interceptor () {
    this._401interceptor = http.interceptors.response.use(
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
    http.interceptors.response.eject(this._401interceptor)
  },

  /**
   * Perform a custom http request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   **/
  customRequest (data) {
    return http(data)
  }
}

export default ApiService
