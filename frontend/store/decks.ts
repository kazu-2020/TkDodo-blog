import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Deck } from '~/types/deck'
import { Pagination } from '~/types/pagination'

export const state = () => ({
  allDecks: [] as Array<Deck>,
  pagination: { totalPages: 1 } as Pagination,
  editingDeck: {} as Deck,
})

export const getters = getterTree(state, {
  allDecks: (state) => state.allDecks,
  editingDeck: (state) => state.editingDeck,
  paginate: (state) => state.pagination,
  sameAs(_state, _getters, _rootState, rootGetters) {
    return rootGetters['sameAs/all']
  },
})

export const mutations = mutationTree(state, {
  setPagination(state, { pagination }) {
    state.pagination = pagination
  },
  setDecks(state, { decks }) {
    state.allDecks = decks
  },
  setEditingDeck(state, { deck }) {
    state.editingDeck = deck
  },
  removeDeck(state, deck) {
    state.allDecks.splice(state.allDecks.indexOf(deck), 1)
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
    async fetchDecks({ commit }, { page, apiState, query }) {
      let url = `/decks?page=${page}&api_state=${apiState}`
      if (query) {
        url += `&query=${query}`
      }

      await this.$axios.get(url).then((response) => {
        commit('setDecks', { decks: response.data.decks })
        commit('setPagination', { pagination: response.data.pagination })
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
    async deleteDeck({ commit }, deck) {
      await this.$axios
        .delete(`/decks/${deck.id}`)
        .then((_response) => {
          commit('removeDeck', deck)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    setEditingDeck({ commit }, deck) {
      commit('setEditingDeck', { deck })
    },
    deleteEditingDeckPlaylist({ commit }, playlist) {
      commit('deleteEditingDeckPlaylist', playlist)
    },
    addEditingDeckPlaylist({ commit }, playlist) {
      commit('addEditingDeckPlaylist', playlist)
    },
    updateEditingDeck({ commit }, deck) {
      commit('updateEditingDeck', deck)
    },
    updateEditingDeckPlaylists({ commit }, playlists) {
      commit('updateEditingDeckPlaylists', playlists)
    },
  }
)
