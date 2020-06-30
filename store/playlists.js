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
    addEditingPlaylistEpisode(state, episode) {
      state.editingPlaylist.items.push(episode)
    },
    // メタ編集画面用
    updateEditingPlaylistName(state, name) {
      state.editingPlaylist.name = name
    },
    updateEditingPlaylistDetailedNameRuby(state, detailedNameRuby) {
      state.editingPlaylist.detailedNameRuby = detailedNameRuby
    },
    updateEditingPlaylistFormatGenre(state, formatGenre) {
      state.editingPlaylist.formatGenre = formatGenre
    },
    updateEditingPlaylistThemeGenre(state, themeGenre) {
      state.editingPlaylist.themeGenre = themeGenre
    },
    updateEditingPlaylistDetailedCatch(state, detailedCatch) {
      state.editingPlaylist.detailedCatch = detailedCatch
    },
    updateEditingPlaylistDescription(state, description) {
      state.editingPlaylist.description = description
    },
    updateEditingPlaylistKeywords(state, keywords) {
      state.editingPlaylist.keywords = keywords
    },
    updateEditingPlaylistHashtag(state, hashtag) {
      state.editingPlaylist.hashtag = hashtag
    },
  },
  actions: {
    async fetchPlaylists({ commit }) {
      await axios
        .get('/api/playlists')
        .then(response =>
          commit('setPlaylists', { playlists: response.data.playlists })
        )
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
    addEditingPlaylistEpisode({ commit }, episode) {
      commit('addEditingPlaylistEpisode', episode)
    },
    // メタ編集画面用
    updateEditingPlaylistName({ commit }, name) {
      commit('updateEditingPlaylistName', name)
    },
    updateEditingPlaylistDetailedNameRuby({ commit }, DetailedNameRuby) {
      commit('updateEditingPlaylistDetailedNameRuby', DetailedNameRuby)
    },
    updateEditingPlaylistFormatGenre({ commit }, formatGenre) {
      commit('updateEditingPlaylistFormatGenre', formatGenre)
    },
    updateEditingPlaylistThemeGenre({ commit }, themeGenre) {
      commit('updateEditingPlaylistThemeGenre', themeGenre)
    },
    updateEditingPlaylistDetailedCatch({ commit }, detailedCatch) {
      commit('updateEditingPlaylistDetailedCatch', detailedCatch)
    },
    updateEditingPlaylistDescription({ commit }, description) {
      commit('updateEditingPlaylistDescription', description)
    },
    updateEditingPlaylistKeywords({ commit }, keywords) {
      commit('updateEditingPlaylistKeywords', keywords)
    },
    updateEditingPlaylistHashtag({ commit }, hashtag) {
      commit('updateEditingPlaylistHashtag', hashtag)
    },
  },
}
