export default {
  namespaced: true,
  state: () => ({
    id: null,
    name: null,
    url: null,
    _destroy: null,
  }),
  getters: {
    id: state => state.id,
    name: state => state.name,
    url: state => state.url,
    _destroy: state => state._destroy,
    all: state => state,
  },
  mutations: {
    updateName(state, name) {
      state.name = name
      state._destroy = undefined
    },
    updateUrl(state, url) {
      state.url = url
      state._destroy = undefined
    },
    delete(state) {
      state.name = null
      state.url = null
      state._destroy = 1
    },
    updateAll(state, sameAs) {
      if (sameAs) {
        state.id = sameAs.id
        state.name = sameAs.name
        state.url = sameAs.url
        state._destroy = sameAs._destroy
      } else {
        state.id = null
        state.name = null
        state.url = null
        state._destroy = null
      }
    },
  },
  actions: {
    updateName({ commit }, name) {
      commit('updateName', name)
    },
    updateUrl({ commit }, url) {
      commit('updateUrl', url)
    },
    delete({ commit }) {
      commit('delete')
    },
    updateAll({ commit }, sameAs) {
      commit('updateAll', sameAs)
    },
  },
}
