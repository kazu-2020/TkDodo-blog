import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Deck } from '~/types/deck'

export const state = () => ({
  allDecks: [] as Array<Deck>,
})

export const getters = getterTree(state, {
  allDecks: (state) => state.allDecks,
})

export const mutations = mutationTree(state, {
  setDecks(state, { decks }) {
    state.allDecks = decks
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
  }
)
