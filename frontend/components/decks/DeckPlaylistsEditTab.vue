<template>
  <div>
    <div class="list-item-container container-fluid white rounded px-5 py-2">
      <v-row>
        <v-col cols="12">
          <deck-playlists
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
          <all-playlists-list
            :ignore-playlists="playlists"
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
import DeckPlaylists from '~/components/decks/DeckPlaylists.vue'
import AllPlaylistsList from '~/components/decks/AllPlaylistsList.vue'

export default Vue.extend({
  name: 'ListEditTab',
  components: {
    DeckPlaylists,
    AllPlaylistsList,
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
