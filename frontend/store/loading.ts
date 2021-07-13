import { getterTree, mutationTree, actionTree } from 'typed-vuex'

export const state = () => ({
  state: 'none', // none -> loading -> {success, error}
  messages: { success: '', error: '' },
})

export const getters = getterTree(state, {
  state: (state) => state.state,
  messages: (state) => state.messages,
})

export const mutations = mutationTree(state, {
  startLoading(state, messages) {
    state.state = 'loading'
    state.messages = messages
  },
  succeedLoading(state) {
    if (state.state === 'loading') state.state = 'success'
  },
  failLoading(state) {
    if (state.state === 'loading') state.state = 'error'
  },
  resetLoadingState(state) {
    state.state = 'none'
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    startLoading({ commit }, messages) {
      commit('startLoading', messages)
    },
    succeedLoading({ commit }) {
      commit('succeedLoading')
    },
    failLoading({ commit }) {
      commit('failLoading')
    },
    resetLoadingState({ commit }) {
      commit('resetLoadingState')
    },
  }
)
