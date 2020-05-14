<template>
  <v-layout column>
    <v-row>
      <v-col>
        <div class="mb-4 headline">{{ playlist.title }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="4" md="4" sm="12" xs="12">
        <v-list-item-avatar tile color="grey" />
      </v-col>
      <v-col lg="8" md="8" sm="12" xs="12">
        <v-list-item-avatar tile color="white" />
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  async asyncData({ store, params }) {
    if (store.getters['playlists/editingPlaylist']) {
      return
    }
    await store.dispatch('playlists/fetchPlaylist', params.id)
  },
})
export default class PlaylistIdPageComponent extends Vue {
  get playlist() {
    return this.$store.state.playlists.editingPlaylist
  }
}
</script>
