import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex'
import { Playlist } from '~/types/playlist'
import { Pagination } from '~/types/pagination'

export const state = () => ({
  allItems: [] as Array<Playlist>,
  pagination: { totalPages: 1 } as Pagination,
  editingPlaylist: {} as Playlist,
})

export const getters = getterTree(state, {
  allItems: (state) => state.allItems,
  paginate: (state) => state.pagination,
  editingPlaylist: (state) => state.editingPlaylist,
  sameAs(_state, _getters, _rootState, rootGetters) {
    return rootGetters['sameAs/all']
  },
})

export const mutations = mutationTree(state, {
  setPlaylists(state, { playlists }) {
    state.allItems = playlists
  },
  setPagination(state, { pagination }) {
    state.pagination = pagination
  },
  setPlaylist(state, { playlist }) {
    state.allItems.unshift(playlist)
  },
  removePlaylist(state, playlist) {
    state.allItems.splice(state.allItems.indexOf(playlist), 1)
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
  updateEditingPlaylistEpisodes(state, episodes) {
    state.editingPlaylist.items = episodes
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchPlaylists({ commit }, page) {
      await this.$axios.get(`/api/playlists?page=${page}`).then((response) => {
        commit('setPlaylists', { playlists: response.data.playlists })
        commit('setPagination', { pagination: response.data.pagination })
      })
    },
    async fetchD5Playlists({ commit }, payloads) {
      await this.$axios
        .get(`/api/playlists?area=${payloads.area}&page=${payloads.page}`)
        .then((response) => {
          commit('setPlaylists', { playlists: response.data.playlists })
          commit('setPagination', { pagination: response.data.pagination })
        })
    },
    async createPlaylists({ commit }, payload) {
      await this.$axios
        .post('/api/playlists', payload)
        .then((response) => commit('setPlaylist', { playlist: response.data }))
    },
    async createPlaylistFromSeries({ commit }, payload) {
      await this.$axios
        .post('/api/playlists/import_from_series', payload)
        .then((response) => commit('setPlaylist', { playlist: response.data }))
    },
    async deletePlaylist({ commit }, playlist) {
      await this.$axios
        .delete(`/api/playlists/${playlist.id}`)
        .then((response) => {
          console.log('status:', response.status)
          commit('removePlaylist', playlist)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async fetchPlaylist({ commit, dispatch }, targetId) {
      await this.$axios.get(`/api/playlists/${targetId}`).then((response) => {
        commit('setEditingPlaylist', { playlist: response.data.playlist })
        dispatch('sameAs/updateAll', response.data.playlist.sameAs, {
          root: true,
        })
      })
    },
    async saveEditingPlaylistEpisodes({ commit, state }) {
      await this.$axios
        .post(
          `/api/playlists/${state.editingPlaylist.id}/playlist_episodes/bulk_update`,
          {
            playlist_episodes: state.editingPlaylist.items,
          }
        )
        .then((response) => {
          commit('updateEditingPlaylistEpisodes', response.data.items)
        })
    },
    deleteEditingPlaylistEpisode({ commit }, episode) {
      commit('deleteEditingPlaylistEpisode', episode)
    },
    addEditingPlaylistEpisode({ commit }, episode) {
      commit('addEditingPlaylistEpisode', episode)
    },
    updateEditingPlaylistEpisodes({ commit }, episodes) {
      commit('updateEditingPlaylistEpisodes', episodes)
    },
  }
)
