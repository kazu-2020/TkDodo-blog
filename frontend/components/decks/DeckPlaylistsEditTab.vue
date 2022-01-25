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
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DeckPlaylists from '~/components/decks/DeckPlaylists.vue'

export default Vue.extend({
  name: 'ListEditTab',
  components: {
    DeckPlaylists,
  },
  props: {
    deck: {
      type: Object,
      required: true,
      default: () => {},
    },
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
