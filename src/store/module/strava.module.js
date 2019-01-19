import ApiService from '../../service/api.service'

const state = {
  athlete: null,
  activities: []
}

const mutations = {
  updateAthlete (state, athlete) {
    state.athlete = athlete
  },
  updateActivities (state, activities) {
    state.activities = activities
  }
}

const actions = {
  async getAthlete ({ commit }) {
    try {
      const response = await ApiService.get('/athlete')
      commit('updateAthlete', response.data)
    } catch (error) {
      // console.log(error);
    }
  },
  async getActivities ({ commit }, params = {}) {
    try {
      const response = await ApiService.get('/athlete/activities', params)
      commit('updateActivities', response.data)
    } catch (error) {
      // console.log(error);
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
