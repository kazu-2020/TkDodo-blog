<template>
  <v-layout column>
    <v-row>
      <v-col lg="4" md="4" sm="12" xs="12">
        <playlist-thumbnail
          :url="eyecatchImageUrl(playlist)"
          disable-input-form
        />
        <v-row justify="center" align="center">
          <v-col cols="12">
            <v-text-field
              v-model="playlist.name"
              :rules="playlist.nameRules"
              label="名前 - Name"
              required
            />
          </v-col>
        </v-row>
        <v-row justify="center" align="center">
          <v-col cols="5" align="right" class="pr-2">
            プレイリストの公開
          </v-col>
          <v-col cols="7">
            <v-radio-group :mandatory="true" row>
              <v-radio label="非公開" value="0" checked="true" />
              <v-radio label="公開" value="1" />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row justify="center" align="center">
          <v-col cols="5" align="right" class="pr-2">
            ID
          </v-col>
          <v-col cols="7" class="pl-2">
            {{ playlist.id }}
          </v-col>
        </v-row>
      </v-col>
      <v-col lg="8" md="8" sm="12" xs="12">
        <playlist-series-meta-tabs :playlist="playlist" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h3>
          エピソード選定
        </h3>
      </v-col>
      <v-col cols="12">
        <playlist-episodes-list :episodes="playlist.items" />
      </v-col>
    </v-row>
    <playlist-episode-search />
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import PlaylistThumbnail from '~/components/PlaylistThumbnail.vue'
import PlaylistSeriesMetaTabs from '~/components/PlaylistSeriesMetaTabs.vue'
import PlaylistEpisodesList from '~/components/PlaylistEpisodesList.vue'
import PlaylistEpisodeSearch from '~/components/PlaylistEpisodeSearch.vue'

interface DataType {
  url: String
}

export default Vue.extend({
  name: 'PlaylistIdIndexComponent',
  components: {
    PlaylistThumbnail,
    PlaylistSeriesMetaTabs,
    PlaylistEpisodesList,
    PlaylistEpisodeSearch,
  },
  async asyncData({ store, params }) {
    if (store.getters['playlists/editingPlaylist']) {
      return
    }
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
  },
  beforeDestroy() {
    this.$store.dispatch('playlists/initializeEditingPlaylist')
  },
  methods: {
    eyecatchImageUrl(playlist: any) {
      return (
        playlist.eyecatch?.medium?.url || 'https://placehold.jp/640x640.png'
      )
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
