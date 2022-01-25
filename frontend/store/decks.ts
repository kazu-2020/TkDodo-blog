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
  }
)
