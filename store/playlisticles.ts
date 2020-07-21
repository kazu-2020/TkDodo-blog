import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex'

export const state = () => ({
  editingPlaylisticle: null,
})

export const getters = getterTree(state, {
  editingPlaylisticle: (state) => state.editingPlaylisticle,
})

export const mutations = mutationTree(state, {
  setEditingPlaylisticle(state, { playlisticle }) {
    state.editingPlaylisticle = playlisticle
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchPlaylisticle({ commit }) {
      await this.$axios.get('/api/playlisticles/sandbox').then((response) =>
        commit('setEditingPlaylisticle', {
          playlisticle: response.data.playlisticle,
        })
      )
    },
    initializeEditingPlaylisticle({ commit }) {
      commit('setEditingPlaylisticle', { playlisticle: null })
    },
  }
)
