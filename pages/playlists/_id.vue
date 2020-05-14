<template>
  <v-layout column>
    <v-row>
      <v-col>
        <div class="mb-4 headline">
          {{ playlist.title }}
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="4" md="4" sm="12" xs="12">
        <playlist-thumbnail :url="url" />
      </v-col>
      <v-col lg="8" md="8" sm="12" xs="12">
        <playlist-series-meta-tabs />
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    PlaylistThumbnail: () => import('~/components/PlaylistThumbnail.vue'),
    PlaylistSeriesMetaTabs: () =>
      import('~/components/PlaylistSeriesMetaTabs.vue'),
  },
  async asyncData({ store, params }) {
    if (store.getters['playlists/editingPlaylist']) {
      return
    }
    await store.dispatch('playlists/fetchPlaylist', params.id)
  },
})
export default class PlaylistIdPageComponent extends Vue {
  url =
    'https://pbs.twimg.com/profile_images/1111451081135943680/d1sPJsQf_400x400.png'

  get playlist() {
    return this.$store.state.playlists.editingPlaylist
  }

  beforeDestroy() {
    this.$store.dispatch('playlists/initializeEditingPlaylist')
  }
}
</script>
