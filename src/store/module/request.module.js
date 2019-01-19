
const state = {
  loading: false
}

const mutations = {
  setLoading (state, value) {
    state.loading = value
  }
}

const actions = {
  requestStart ({ commit }) {
    commit('setLoading', true)
  },
  requestStop ({ commit }) {
    commit('setLoading', false)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
