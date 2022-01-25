import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Deck } from '~/types/deck'

export const state = () => ({
  allDecks: [] as Array<Deck>,
  editingDeck: {} as Deck,
})

export const getters = getterTree(state, {
  allDecks: (state) => state.allDecks,
  editingDeck: (state) => state.editingDeck,
})

export const mutations = mutationTree(state, {
  setDecks(state, { decks }) {
    state.allDecks = decks
  },
  setEditingDeck(state, { deck }) {
    state.editingDeck = deck
  },
  deleteEditingDeckPlaylist(state, playlist) {
    state.editingDeck.playlists.splice(
      state.editingDeck.playlists.indexOf(playlist),
      1
    )
  },
  updateEditingDeck(state, deck) {
    state.editingDeck = deck
  },
  addEditingDeckPlaylist(state, playlist) {
    state.editingDeck.playlists.push(playlist)
  },
  updateEditingDeckPlaylists(state, playlists) {
    state.editingDeck.playlists = playlists
  },
})
export const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchDecks({ commit }) {
      await this.$axios.get('/decks').then((response) => {
        commit('setDecks', { decks: response.data.decks })
      })
    },
    async fetchDeck({ commit, dispatch }, targetId) {
      await this.$axios.get(`/decks/${targetId}`).then((response) => {
        commit('setEditingDeck', { deck: response.data.deck })
        dispatch('sameAs/updateAll', response.data.deck.sameAs, {
          root: true,
        })
      })
    },
    setEditingDeck({ commit }, playlist) {
      commit('setEditingDeck', { playlist })
    },
    deleteEditingDeckPlaylist({ commit }, playlist) {
      commit('deleteEditingDeckPlaylist', playlist)
    },
    addEditingDeckPlaylist({ commit }, playlist) {
      commit('addEditingDeckPlaylist', playlist)
    },
    updateEditingDeck({ commit }, playlist) {
      commit('updateEditingDeck', playlist)
    },
    updateEditingDeckPlaylists({ commit }, playlists) {
      commit('updateEditingDeckPlaylists', playlists)
    },
  }
)
