<template>
  <tr class="result_row" style="cursor: pointer" @click.stop="clickPlaylist">
    <td>
      <v-btn
        v-if="!shouldIgnorePlaylist"
        tile
        small
        color="orange"
        class="add_button"
        @click="addPlaylist(playlist)"
      >
        <v-icon> mdi-plus </v-icon>
      </v-btn>
      <div v-else>追加済み</div>
    </td>
    <td>
      <v-img
        :src="logoUrl"
        lazy-src="https://placehold.jp/40x40.png"
        width="40"
        class="ma-2 playlist-image"
      />
    </td>
    <td>{{ playlist.name }}</td>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'SeriesPlaylistSearchResultTableRow',
  props: {
    playlist: {
      type: Object,
      required: true,
    },
    ignorePlaylists: {
      type: Array,
      required: true,
    },
  },
  computed: {
    shouldIgnorePlaylist(): boolean {
      return this.ignorePlaylists
        .map((pl: any) => pl.seriesId)
        .includes(this.playlist.seriesId)
    },
    logoUrl(): string {
      if (this.playlist.logo !== undefined) {
        return this.playlist.logo.medium.url
      } else if ((this.playlist.keyvisuals || [])[0] !== undefined) {
        return this.playlist.keyvisuals[0].small.url
      }

      return 'https://placehold.jp/71x40.png'
    },
  },
  methods: {
    addPlaylist(playlist: any): void {
      this.$emit('add-playlist', playlist)
    },
    clickPlaylist() {
      this.$emit('select-playlist', this.playlist)
    },
  },
})
</script>

<style lang="scss">
.result_row {
  .add_button.v-btn.v-btn--tile.v-size--small {
    min-width: 0;
    padding: 0 2px;
  }
}
</style>
