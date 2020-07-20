export default {
  namespaced: true,
  state: () => ({
    state: 'none', // none -> loading -> {success, error}
    messages: { success: '', error: '' },
  }),
  getters: {
    state: (state) => state.state,
    messages: (state) => state.messages,
  },
  mutations: {
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
  },
  actions: {
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
  },
}
