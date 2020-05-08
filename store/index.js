import Vuex from 'vuex'
import axios from 'axios'

export default () =>
  new Vuex.Store({
    state: {
      playlists: [],
    },
    getters: {
      playlists: state => state.playlists,
    },
    mutations: {
      setPlaylists(state, { playlists }) {
        state.playlists = playlists
      },
    },
    actions: {
      async fetchPlaylists({ commit }) {
        await axios
          .get('/api/playlists')
          .then(response =>
            commit('setPlaylists', { playlists: response.data })
          )
      },
    },
  })
