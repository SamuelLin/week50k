import { UserService, AuthenticationError } from '../../service/user.service'
import { TokenService } from '../../service/storage.service'
import router from '../../router'

const state = {
  authenticating: false,
  accessToken: TokenService.getToken(),
  authenticationErrorCode: 0,
  authenticationError: '',
  refreshTokenPromise: null,
  user: null
}

const getters = {
  loggedIn: (state) => {
    return !!state.accessToken
  },

  authenticationErrorCode: (state) => {
    return state.authenticationErrorCode
  },

  authenticationError: (state) => {
    return state.authenticationError
  },

  authenticating: (state) => {
    return state.authenticating
  }
}

const actions = {
  async login ({ commit }, code) {
    commit('loginRequest')

    try {
      const token = await UserService.login(code)
      commit('loginSuccess', token)

      // Redirect the user to the page he first tried to visit or to the home view
      router.push(router.history.current.query.redirect || '/')

      return true
    } catch (e) {
      if (e instanceof AuthenticationError) {
        commit('loginError', {
          errorCode: e.errorCode,
          errorMessage: e.message
        })
      }

      return false
    }
  },

  logout ({ commit }) {
    UserService.logout()
    commit('logoutSuccess')
    router.push('/login')
  },

  refreshToken ({ commit, state, dispatch }) {
    // If this is the first time the refreshToken has been called, make a request
    // otherwise return the same promise to the caller
    if (!state.refreshTokenPromise) {
      const p = UserService.refreshToken()
      commit('refreshTokenPromise', p)

      // Wait for the UserService.refreshToken() to resolve. On success set the token and clear promise
      // Clear the promise on error as well.
      p.then(
        (response) => {
          commit('refreshTokenPromise', null)
          commit('loginSuccess', response)
        },
        (error) => {
          console.log(error)
          dispatch('logout')
          commit('refreshTokenPromise', null)
        }
      )
    }

    return state.refreshTokenPromise
  }
}

const mutations = {
  loginRequest (state) {
    state.authenticating = true
    state.authenticationError = ''
    state.authenticationErrorCode = 0
  },

  loginSuccess (state, accessToken) {
    state.accessToken = accessToken
    state.authenticating = false
  },

  loginError (state, { errorCode, errorMessage }) {
    state.authenticating = false
    state.authenticationErrorCode = errorCode
    state.authenticationError = errorMessage
  },

  logoutSuccess (state) {
    state.accessToken = ''
  },

  refreshTokenPromise (state, promise) {
    state.refreshTokenPromise = promise
  },

  updateUser (state, { user }) {
    state.user = user
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
