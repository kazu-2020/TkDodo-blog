import axios from 'axios'

export default {
  namespaced: true,
  state: () => ({
    editingPlaylisticle: null,
  }),
  getters: {
    editingPlaylisticle: state => state.editingPlaylisticle,
  },
  mutations: {
    setEditingPlaylisticle(state, { playlisticle }) {
      state.editingPlaylisticle = playlisticle
    },
  },
  actions: {
    async fetchPlaylisticle({ commit }) {
      await axios.get('/api/playlisticles/sandbox').then(response =>
        commit('setEditingPlaylisticle', {
          playlisticle: response.data.playlisticle,
        })
      )
    },
    initializeEditingPlaylisticle({ commit }) {
      commit('setEditingPlaylisticle', { playlisticle: null })
    },
  },
}
