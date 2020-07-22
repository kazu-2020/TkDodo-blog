import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex'

export const state = () => ({
  id: null,
  name: null,
  url: null,
  _destroy: 0,
})

export const getters = getterTree(state, {
  id: (state) => state.id,
  name: (state) => state.name,
  url: (state) => state.url,
  _destroy: (state) => state._destroy,
  all: (state) => state,
})
export const mutations = mutationTree(state, {
  updateName(state, name) {
    state.name = name
    state._destroy = 0
  },
  updateUrl(state, url) {
    state.url = url
    state._destroy = 0
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
      state._destroy = 0
    }
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
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
  }
)
