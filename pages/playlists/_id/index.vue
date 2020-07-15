<template>
  <v-layout column>
    <v-row>
      <v-col cols="12">
        <v-card :color="headerCardColor()">
          <v-row>
            <v-col cols="10" class="d-flex flex-row">
              <div>
                <v-avatar class="ma-3" size="125" tile>
                  <v-img :src="eyecatchImageUrl(playlist)" />
                </v-avatar>
              </div>
              <div>
                <v-card-title class="headline">
                  {{ playlist.name }}
                  <v-card-subtitle
                    v-if="playlist.detailedNameRuby"
                    class="detailed-name-ruby"
                  >
                    ( {{ playlist.detailedNameRuby }} )
                  </v-card-subtitle>
                  <div class="chips">
                    <v-chip class="ma-2" small>
                      非公開
                    </v-chip>
                    <v-chip
                      class="ma-2"
                      color="primary"
                      small
                      @click="copyPlaylistId"
                    >
                      ID: {{ playlist.id }}
                    </v-chip>
                    <v-chip
                      v-if="playlist.originalSeriesId"
                      class="ma-2"
                      color="secondary"
                      small
                      @click="copySeriesId"
                    >
                      SeriesID: {{ playlist.originalSeriesId }}
                    </v-chip>
                  </div>
                </v-card-title>
                <v-card-subtitle v-if="playlist.detailedCatch">
                  ~ {{ playlist.detailedCatch }} ~
                </v-card-subtitle>
                <v-card-text v-text="playlist.description" />
              </div>
            </v-col>
            <v-col cols="2" class="text-right pl-0">
              <v-btn
                :color="headerCardButtonColor()"
                text
                :to="`/playlists/${playlist.id}/edit`"
                nuxt
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h3>
          エピソード選定
        </h3>
      </v-col>
      <v-col cols="12">
        <playlist-episodes-list />
      </v-col>
    </v-row>
    <playlist-episode-search :ignore-episodes="playlist.items" />
    <v-row>
      <v-col cols="12" align="center">
        <v-btn color="orange" @click="saveEpisodes">
          上記の内容で保存する
        </v-btn>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" timeout="2000">
      コピーしました
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import PlaylistEpisodesList from '~/components/PlaylistEpisodesList.vue'
import PlaylistEpisodeSearch from '~/components/PlaylistEpisodeSearch.vue'

interface DataType {
  snackbar: boolean
  url: String
}

export default Vue.extend({
  name: 'PlaylistIdIndexComponent',
  components: {
    PlaylistEpisodesList,
    PlaylistEpisodeSearch,
  },
  async asyncData({ store, params }) {
    await store.dispatch('playlists/fetchPlaylist', params.id)
  },
  data(): DataType {
    return {
      snackbar: false,
      url:
        'https://pbs.twimg.com/profile_images/1111451081135943680/d1sPJsQf_400x400.png',
    }
  },
  computed: {
    playlist() {
      return this.$store.state.playlists.editingPlaylist
    },
    vuetify(): any {
      return (this as any).$vuetify
    },
  },
  methods: {
    eyecatchImageUrl(playlist: any) {
      return (
        playlist.eyecatch?.medium?.url || 'https://placehold.jp/100x100.png'
      )
    },
    headerCardColor() {
      return this.vuetify.theme.dark ? '#616161' : '#F5F5F5'
    },
    headerCardButtonColor() {
      return this.vuetify.theme.dark ? '#FFFFFF' : '#000000'
    },
    saveEpisodes() {
      this.$store.dispatch('loading/startLoading', {
        success: '正常に保存できました',
        error: '保存できませんでした',
      })
      this.$store.dispatch('playlists/saveEditingPlaylistEpisodes')
    },
    copyPlaylistId() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.playlist.id)
        this.snackbar = true
      }
    },
    copySeriesId() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.playlist.originalSeriesId)
        this.snackbar = true
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.v-card__subtitle.detailed-name-ruby {
  padding: 8px;
}

.v-input.episode-search.v-text-field.v-text-field--single-line.v-text-field--solo.v-text-field--is-booted.v-text-field--enclosed {
  .v-text-field__details {
    display: none;
  }
}
</style>
