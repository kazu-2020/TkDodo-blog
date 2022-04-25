<template>
  <div>
    <v-list three-line>
      <template v-for="playlist in filteredPlaylists">
        <v-list-item :key="`${playlist.stringId}-dp-preview`">
          <v-list-item-avatar tile>
            <v-img :src="logoUrl(playlist)" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ playlist.name }}
            </v-list-item-title>
            <series-deck-playlist-episode-preview :playlist="playlist" />
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
import moment from 'moment'
import { Playlist } from '~/types/playlist'
import SeriesDeckPlaylistEpisodePreview from '~/components/seriesDecks/SeriesDeckPlaylistEpisodePreview.vue'

export default Vue.extend({
  name: 'DeckPlaylistPreviewer',
  components: {
    SeriesDeckPlaylistEpisodePreview,
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
      return playlist.logo?.medium?.url || this.dummyImage(playlist.dateCreated)
    },
    dummyImage(time: any): string {
      const logoNumber = (Number(moment(time).format('DD')) % 10) + 1
      return `/dummy/default${logoNumber}/default${logoNumber}-logo.png`
    },
  },
})
</script>
