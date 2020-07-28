import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex'
import { Playlist } from '~/types/plyalist'

export const state = () => ({
  allItems: [] as Array<Playlist>,
  editingPlaylist: {} as Playlist,
})

export const getters = getterTree(state, {
  allItems: (state) => state.allItems,
  editingPlaylist: (state) => state.editingPlaylist,
  sameAs(_state, _getters, _rootState, rootGetters) {
    return rootGetters['sameAs/all']
  },
})

export const mutations = mutationTree(state, {
  setPlaylists(state, { playlists }) {
    state.allItems = playlists
  },
  setPlaylist(state, { playlist }) {
    state.allItems.unshift(playlist)
  },
  removePlaylist(state, playlist) {
    state.allItems.splice(state.allItems.indexOf(playlist), 1)
  },
  setEditingPlaylist(state, { playlist }) {
    state.editingPlaylist = playlist
  },
  deleteEditingPlaylistEpisode(state, episode) {
    state.editingPlaylist.items.splice(
      state.editingPlaylist.items.indexOf(episode),
      1
    )
  },
  addEditingPlaylistEpisode(state, episode) {
    state.editingPlaylist.items.push(episode)
  },
  // メタ編集画面用
  updateEditingPlaylistName(state, name) {
    state.editingPlaylist.name = name
  },
  updateEditingPlaylistDetailedNameRuby(state, detailedNameRuby) {
    state.editingPlaylist.detailedNameRuby = detailedNameRuby
  },
  updateEditingPlaylistFormatGenre(state, formatGenre) {
    state.editingPlaylist.formatGenre = formatGenre
  },
  updateEditingPlaylistThemeGenre(state, themeGenre) {
    state.editingPlaylist.themeGenre = themeGenre
  },
  updateEditingPlaylistDetailedCatch(state, detailedCatch) {
    state.editingPlaylist.detailedCatch = detailedCatch
  },
  updateEditingPlaylistDescription(state, description) {
    state.editingPlaylist.description = description
  },
  updateEditingPlaylistKeywords(state, keywords) {
    state.editingPlaylist.keywords = keywords
  },
  updateEditingPlaylistHashtag(state, hashtag) {
    state.editingPlaylist.hashtag = hashtag
  },
  updateEditingPlaylistEpisodes(state, episodes) {
    state.editingPlaylist.items = episodes
  },
  updateEditingPlaylistLogo(state, image) {
    state.editingPlaylist.logoImageData = image
  },
  updateEditingPlaylistEyecatch(state, image) {
    state.editingPlaylist.eyecatchImageData = image
  },
  updateEditingPlaylistHero(state, image) {
    state.editingPlaylist.heroImageData = image
  },
  updateEditingPlaylistSelectedPalette(state, color) {
    state.editingPlaylist.selectedPalette = color
  },
  updateEditingPlaylistPrimaryLightColor(state, color) {
    state.editingPlaylist.primaryLightColor = color
  },
  updateEditingPlaylistPrimaryDarkColor(state, color) {
    state.editingPlaylist.primaryDarkColor = color
  },
  updateEditingPlaylistLinkLightColor(state, color) {
    state.editingPlaylist.linkLightColor = color
  },
  updateEditingPlaylistLinkDarkColor(state, color) {
    state.editingPlaylist.linkDarkColor = color
  },
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchPlaylists({ commit }) {
      await this.$axios
        .get('/api/playlists')
        .then((response) =>
          commit('setPlaylists', { playlists: response.data.playlists })
        )
    },
    async fetchD5Playlists({ commit }, area) {
      await this.$axios
        .get(`/api/playlists?area=${area}`)
        .then((response) =>
          commit('setPlaylists', { playlists: response.data.playlists })
        )
    },
    async createPlaylists({ commit }, payload) {
      await this.$axios
        .post('/api/playlists', payload)
        .then((response) => commit('setPlaylist', { playlist: response.data }))
    },
    async createPlaylistFromSeries({ commit }, payload) {
      await this.$axios
        .post('/api/playlists/import_from_series', payload)
        .then((response) => commit('setPlaylist', { playlist: response.data }))
    },
    async deletePlaylist({ commit }, playlist) {
      await this.$axios
        .delete(`/api/playlists/${playlist.id}`)
        .then((response) => {
          console.log('status:', response.status)
          commit('removePlaylist', playlist)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async fetchPlaylist({ commit, dispatch }, targetId) {
      await this.$axios.get(`/api/playlists/${targetId}`).then((response) => {
        commit('setEditingPlaylist', { playlist: response.data.playlist })
        dispatch('sameAs/updateAll', response.data.playlist.sameAs, {
          root: true,
        })
      })
    },
    async updateEditingPlaylist({ commit, state, getters }) {
      const body: { [key: string]: string } = {
        name: state.editingPlaylist.name,
        detailed_name_ruby: state.editingPlaylist.detailedNameRuby,
        description: state.editingPlaylist.description,
        keywords: state.editingPlaylist.keywords,
        detailed_catch: state.editingPlaylist.detailedCatch,
        hashtag: state.editingPlaylist.hashtag,
        format_genre_code: state.editingPlaylist.formatGenre,
        theme_genre_code: state.editingPlaylist.themeGenre,
        selected_palette: state.editingPlaylist.selectedPalette,
        primary_light_color: state.editingPlaylist.primaryLightColor,
        primary_dark_color: state.editingPlaylist.primaryDarkColor,
        text_light_color: state.editingPlaylist.textLightColor,
        text_dark_color: state.editingPlaylist.textDarkColor,
        link_light_color: state.editingPlaylist.linkLightColor,
        link_dark_color: state.editingPlaylist.linkDarkColor,
        reserve_publish_time_at: state.editingPlaylist.reservePublishTimeAt,
        reserve_finish_time_at: state.editingPlaylist.reserveFinishTimeAt,
      }

      if (state.editingPlaylist.logoImageData !== undefined) {
        Object.assign(body, {
          logo_image: state.editingPlaylist.logoImageData,
        })
      }
      if (state.editingPlaylist.eyecatchImageData !== undefined) {
        Object.assign(body, {
          eyecatch_image: state.editingPlaylist.eyecatchImageData,
        })
      }
      if (state.editingPlaylist.heroImageData !== undefined) {
        Object.assign(body, {
          hero_image: state.editingPlaylist.heroImageData,
        })
      }

      const data = new FormData()
      for (const key in body) {
        if (body[key] !== undefined && body[key] !== null) {
          data.append(`playlist[${key}]`, body[key])
        }
      }

      if (
        getters.sameAs.id ||
        getters.sameAs.name ||
        getters.sameAs.url ||
        getters.sameAs._destroy
      ) {
        data.append('playlist[same_as_attributes][id]', getters.sameAs.id)
        data.append('playlist[same_as_attributes][name]', getters.sameAs.name)
        data.append('playlist[same_as_attributes][url]', getters.sameAs.url)
        data.append(
          'playlist[same_as_attributes][_destroy]',
          getters.sameAs._destroy
        )
      }

      await this.$axios
        .put(`/api/playlists/${state.editingPlaylist.id}`, data)
        .then((response) =>
          commit('setEditingPlaylist', { playlist: response.data.playlist })
        )
    },
    async saveEditingPlaylistEpisodes({ commit, state }) {
      await this.$axios
        .post(
          `/api/playlists/${state.editingPlaylist.id}/playlist_episodes/bulk_update`,
          {
            playlist_episodes: state.editingPlaylist.items,
          }
        )
        .then((response) => {
          commit('updateEditingPlaylistEpisodes', response.data.items)
        })
    },
    deleteEditingPlaylistEpisode({ commit }, episode) {
      commit('deleteEditingPlaylistEpisode', episode)
    },
    addEditingPlaylistEpisode({ commit }, episode) {
      commit('addEditingPlaylistEpisode', episode)
    },
    // メタ編集画面用
    updateEditingPlaylistName({ commit }, name) {
      commit('updateEditingPlaylistName', name)
    },
    updateEditingPlaylistDetailedNameRuby({ commit }, detailedNameRuby) {
      commit('updateEditingPlaylistDetailedNameRuby', detailedNameRuby)
    },
    updateEditingPlaylistFormatGenre({ commit }, formatGenre) {
      commit('updateEditingPlaylistFormatGenre', formatGenre)
    },
    updateEditingPlaylistThemeGenre({ commit }, themeGenre) {
      commit('updateEditingPlaylistThemeGenre', themeGenre)
    },
    updateEditingPlaylistDetailedCatch({ commit }, detailedCatch) {
      commit('updateEditingPlaylistDetailedCatch', detailedCatch)
    },
    updateEditingPlaylistDescription({ commit }, description) {
      commit('updateEditingPlaylistDescription', description)
    },
    updateEditingPlaylistKeywords({ commit }, keywords) {
      commit('updateEditingPlaylistKeywords', keywords)
    },
    updateEditingPlaylistHashtag({ commit }, hashtag) {
      commit('updateEditingPlaylistHashtag', hashtag)
    },
    updateEditingPlaylistEpisodes({ commit }, episodes) {
      commit('updateEditingPlaylistEpisodes', episodes)
    },
    updateEditingPlaylistLogo({ commit }, image) {
      commit('updateEditingPlaylistLogo', image)
    },
    updateEditingPlaylistEyecatch({ commit }, image) {
      commit('updateEditingPlaylistEyecatch', image)
    },
    updateEditingPlaylistHero({ commit }, image) {
      commit('updateEditingPlaylistHero', image)
    },
    updateEditingPlaylistSelectedPalette({ commit }, color) {
      commit('updateEditingPlaylistSelectedPalette', color)
    },
    updateEditingPlaylistPrimaryLightColor({ commit }, color) {
      commit('updateEditingPlaylistPrimaryLightColor', color)
    },
    updateEditingPlaylistPrimaryDarkColor({ commit }, color) {
      commit('updateEditingPlaylistPrimaryDarkColor', color)
    },
    updateEditingPlaylistLinkLightColor({ commit }, color) {
      commit('updateEditingPlaylistLinkLightColor', color)
    },
    updateEditingPlaylistLinkDarkColor({ commit }, color) {
      commit('updateEditingPlaylistLinkDarkColor', color)
    },
  }
)
