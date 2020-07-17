<template>
  <v-layout column>
    <v-row>
      <v-col cols="12">
        <v-card :color="headerCardColor()">
          <v-container>
            <v-row justify="space-between">
              <v-col cols="auto">
                <v-img :src="logoImageUrl(playlist)" width="140" />
              </v-col>
              <v-col class="mr-auto">
                <v-card-title class="headline pt-0">
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
              </v-col>
              <v-col cols="auto" class="text-center">
                <v-row class="flex-column ma-0 fill-height">
                  <v-col class="px-0 pt-0">
                    <v-btn
                      :color="headerCardButtonColor()"
                      icon
                      :to="`/playlists/${playlist.id}/edit`"
                      nuxt
                      small
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col class="px-0 pt-0">
                    <v-btn :color="headerCardButtonColor()" icon small>
                      <v-icon>mdi-code-json</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col />
                  <v-col />
                </v-row>
              </v-col>
            </v-row>
          </v-container>
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
import moment from 'moment'
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
    logoImageUrl(playlist: any) {
      return playlist.logo?.medium?.url || this.dummyImage(playlist.dateCreated)
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
    dummyImage(time: any) {
      const logoNumber = (Number(moment(time).format('DD')) % 10) + 1
      return `/dummy/default${logoNumber}/default${logoNumber}-logo.png`
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
