<template>
  <v-layout column style="position: relative">
    <v-row style="position: relative" class="mt-4">
      <v-col cols="auto">
        <playlist-stepper />
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="orange"
          class="save-button"
          elevation="0"
          style="position: absolute; right: 0"
          >保存する</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9" class="list-item-container mt-4">
        <h2>リスト</h2>
        <playlist-episodes-list
          :episodes="playlistItems"
          @update-episodes="updateEpisodes"
          @delete-episode="deleteEpisode"
        />
      </v-col>
      <v-col cols="3" class="preview-container">
        <div class="preview-container-inner mt-1 pa-2">
          <basic-information-view :playlist="playlist" />
        </div>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Playlist } from '@/types/playlist'
import PlaylistEpisodesList from '~/components/playlists/PlaylistEpisodesList.vue'
import PlaylistStepper from '~/components/playlists/PlaylistStepper.vue'
import BasicInformationView from '~/components/playlists/BasicInformationView.vue'

export default Vue.extend({
  name: 'PlaylistIdEdit2Page',
  components: {
    PlaylistEpisodesList,
    BasicInformationView,
    PlaylistStepper,
  },
  async asyncData({ store, params }) {
    await store.dispatch('playlists/fetchPlaylist', params.id)
  },
  computed: {
    playlist(): Playlist {
      return this.$store.state.playlists.editingPlaylist
    },
    playlistItems(): Array<Object> {
      return this.$store.state.playlists.editingPlaylist.items
    },
  },
  methods: {
    updateEpisodes() {
      // noop
    },
    deleteEpisode() {
      // noop
    },
  },
})
</script>

<style lang="scss" scoped>
.save-button {
  color: white;
  width: 140px;
}

.list-item-container {
  background-color: white;
  border-radius: 6px;
}

.preview-container-inner {
  background-color: white;
  border-radius: 6px;
}
</style>
