<template>
  <div>
    <div class="list-item-container container-fluid white rounded px-5 py-2">
      <v-row>
        <v-col cols="12">
          <series-deck-playlists
            :deck="deck"
            @delete-playlist="deletePlaylist"
            @update-playlists="updatePlaylists"
          />
          <div v-if="deck.playlists.length === 0" class="pa-4 text-center">
            編成可能なプレイリストからプレイリストを追加してください
          </div>
        </v-col>
      </v-row>
      <v-row class="pt-4">
        <v-col cols="12">
          <series-playlist-search
            :ignore-playlists="playlists"
            :keywords.sync="keywords"
            @add-playlist="addPlaylist"
            @select-playlist="selectPlaylist"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SeriesDeckPlaylists from '~/components/seriesDecks/SeriesDeckPlaylists.vue'
import SeriesPlaylistSearch from '~/components/seriesDecks/SeriesPlaylistSearch.vue'

export default Vue.extend({
  name: 'SeriesDeckPlaylistEditTab',
  components: {
    SeriesDeckPlaylists,
    SeriesPlaylistSearch,
  },
  props: {
    deck: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      keywords: '',
      selectedPlaylist: undefined,
      previewDrawer: false,
    }
  },
  computed: {
    playlists(): Array<Object> {
      return this.deck.playlists || []
    },
  },
  methods: {
    addPlaylist(playlist: any) {
      this.$emit('add-playlist', playlist)
    },
    deletePlaylist(playlist: any) {
      this.$emit('delete-playlist', playlist)
    },
    selectPlaylist(playlist: any) {
      this.selectedPlaylist = playlist
      this.previewDrawer = true
    },
    eyecatchUrl(item: any): string {
      if (item.eyecatch !== undefined) {
        return item.eyecatch.medium.url
      } else {
        return ''
      }
    },
    updatePlaylists(playlists: any) {
      this.$emit('update-playlists', playlists)
    },
  },
})
</script>

<style lang="scss" scoped>
span.diff_episodes_count {
  font-weight: bold;
}
</style>
