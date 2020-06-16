import axios from 'axios'

export default {
  namespaced: true,
  state: () => ({
    allItems: [],
    editingPlaylist: null,
  }),
  getters: {
    allItems: state => state.allItems,
    editingPlaylist: state => state.editingPlaylist,
  },
  mutations: {
    setPlaylists(state, { playlists }) {
      state.allItems = playlists
    },
    setPlaylist(state, { playlist }) {
      state.allItems.unshift(playlist)
    },
    setEditingPlaylist(state, { playlist }) {
      state.editingPlaylist = playlist
    },
    deleteEditingPlaylistEpisode(state, episode) {
      state.editingPlaylist.items.splice(
        state.editingPlaylist.items.indexOf(episode),
        1
      )
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
    async fetchPlaylist({ commit }, targetId) {
      await axios
        .get(`/api/playlists/${targetId}`)
        .then(response =>
          commit('setEditingPlaylist', { playlist: response.data.playlist })
        )
    },
    initializeEditingPlaylist({ commit }) {
      commit('setEditingPlaylist', { playlist: null })
    },
    deleteEditingPlaylistEpisode({ commit }, episode) {
      commit('deleteEditingPlaylistEpisode', episode)
    },
  },
}
