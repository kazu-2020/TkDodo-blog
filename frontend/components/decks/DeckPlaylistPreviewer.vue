<template>
  <div>
    <v-list three-line>
      <template v-for="playlist in filteredPlaylists">
        <v-list-item :key="`${playlist.playlistUId}-dp-preview`">
          <v-list-item-avatar tile>
            <v-img :src="logoUrl(playlist)" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ playlist.name }}
            </v-list-item-title>
            <deck-playlist-episode-preview :playlist="playlist" />
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list-item v-if="playlists.length > 10">
        <v-list-item-content>
          他 {{ otherPlaylistCount }} 件
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Playlist } from '~/types/playlist'
import DeckPlaylistEpisodePreview from '~/components/decks/DeckPlaylistEpisodePreview.vue'
import DummyImageHelper from '~/utils/DummyImageHelper'

export default Vue.extend({
  name: 'DeckPlaylistPreviewer',
  components: {
    DeckPlaylistEpisodePreview,
  },
  props: {
    deck: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  computed: {
    playlists(): Playlist[] {
      return this.deck?.playlists || []
    },
    filteredPlaylists(): Playlist[] {
      return this.playlists.slice(0, 10)
    },
    otherPlaylistCount(): number {
      return this.playlists.length - this.filteredPlaylists.length
    },
  },
  methods: {
    logoUrl(playlist: any) {
      return (
        playlist.logo?.medium?.url ||
        DummyImageHelper.getPath(playlist.dateCreated, 'logo')
      )
    },
  },
})
</script>
