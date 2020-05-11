import axios from 'axios'

export default {
  namespaced: true,
  state: () => ({
    allItems: [],
  }),
  getters: {
    allItems: state => state.allItems,
  },
  mutations: {
    setPlaylists(state, { playlists }) {
      state.allItems = playlists
    },
  },
  actions: {
    async fetchPlaylists({ commit }) {
      await axios
        .get('/api/playlists')
        .then(response => commit('setPlaylists', { playlists: response.data }))
    },
  },
}
