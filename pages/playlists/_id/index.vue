<template>
  <v-layout column>
    <v-row>
      <v-col cols="12">
        <v-card :color="headerCardColor()">
          <v-row>
            <v-col cols="10" class="d-flex flex-row">
              <div>
                <v-avatar class="ma-3" size="125" tile>
                  <playlist-thumbnail
                    :url="eyecatchImageUrl(playlist)"
                    disable-input-form
                  />
                </v-avatar>
              </div>
              <div>
                <v-card-title class="headline" v-text="playlist.name" />
                <v-card-subtitle v-text="playlist.nameRuby" />
                <v-card-text>
                  公開状況: 非公開<br />
                  ID: {{ playlist.id }}<br />
                  キャッチコピー: {{ playlist.detailedCatch }}<br />
                  説明: {{ playlist.description }}<br />
                </v-card-text>
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
    <playlist-episode-search />
    <v-row>
      <v-col cols="12" align="center">
        <v-btn color="orange" @click="saveEpisodes">
          上記の内容で保存する
        </v-btn>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import PlaylistThumbnail from '~/components/PlaylistThumbnail.vue'
import PlaylistEpisodesList from '~/components/PlaylistEpisodesList.vue'
import PlaylistEpisodeSearch from '~/components/PlaylistEpisodeSearch.vue'

interface DataType {
  url: String
}

export default Vue.extend({
  name: 'PlaylistIdIndexComponent',
  components: {
    PlaylistThumbnail,
    PlaylistEpisodesList,
    PlaylistEpisodeSearch,
  },
  async asyncData({ store, params }) {
    await store.dispatch('playlists/fetchPlaylist', params.id)
  },
  data(): DataType {
    return {
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
  },
})
</script>

<style lang="scss" scoped>
.v-input.episode-search.v-text-field.v-text-field--single-line.v-text-field--solo.v-text-field--is-booted.v-text-field--enclosed {
  .v-text-field__details {
    display: none;
  }
}
</style>
