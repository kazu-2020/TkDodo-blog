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
    setPlaylist(state, { playlist }) {
      state.allItems.unshift(playlist)
    },
  },
  actions: {
    async fetchPlaylists({ commit }) {
      await axios
        .get('/api/playlists')
        .then(response => commit('setPlaylists', { playlists: response.data }))
    },
    async createPlaylists({ commit }, payload) {
      await axios
        .post('/api/playlists', payload)
        .then(response => commit('setPlaylist', { playlist: response.data }))
    },
  },
}
