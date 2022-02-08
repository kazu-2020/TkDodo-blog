import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { DeckLabel } from '~/types/deckLabel'

export const state = () => ({
  allItems: [] as Array<DeckLabel>,
})

export const getters = getterTree(state, {
  allItems: (state) => state.allItems,
})

export const mutations = mutationTree(state, {
  setDeckLabels(state, { deckLabels }) {
    state.allItems = deckLabels
  },
})
export const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchDeckLabels({ commit }) {
      await this.$axios.get('/deck_labels').then((response) => {
        commit('setDeckLabels', { deckLabels: response.data.deckLabels })
      })
    },
  }
)
