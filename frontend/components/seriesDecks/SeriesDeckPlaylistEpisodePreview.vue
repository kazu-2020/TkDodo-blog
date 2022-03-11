<template>
  <div>
    <div v-if="episodes.length === 0" align="center" class="height-100">
      <v-container fill-height fluid>
        <v-row v-if="isError" align="center" justify="center"
          ><v-col>エラーが発生しました</v-col></v-row
        >
        <v-row v-else-if="isFetched" align="center" justify="center"
          ><v-col>エピソードはありません</v-col></v-row
        >
        <v-row v-else align="center" justify="center"
          ><v-col><v-progress-circular indeterminate color="amber" /></v-col
        ></v-row>
      </v-container>
    </div>
    <div v-else>
      <div v-for="episode in episodes" :key="`${episode.id}-deck-prv`">
        <v-img
          :src="episodeEyecatchUrl(episode)"
          aspect-ratio="1.33"
          class="float-left mr-1"
          width="50"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { EpisodeData } from '~/types/episode_data'

interface DataType {
  episodes: Array<EpisodeData>
  isError: boolean
  isFetched: boolean
}

export default Vue.extend({
  name: 'DeckPlaylistEpisodePreview',
  props: {
    playlist: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      episodes: [],
      isError: false,
      isFetched: false,
    }
  },
  mounted() {
    this.fetchPlaylistEpisodes()
  },
  methods: {
    episodeEyecatchUrl(episode: any): string {
      return (
        episode.eyecatch?.medium?.url || this.dummyImage(episode.dateCreated)
      )
    },
    dummyImage(time: any): string {
      const logoNumber = (Number(moment(time).format('DD')) % 10) + 1
      return `/dummy/default${logoNumber}/default${logoNumber}-logo.png`
    },
    fetchPlaylistEpisodes() {
      if (this.episodes.length !== 0) return

      this.$axios
        .get(`/series_playlists/${this.playlist.id}/episodes`)
        .then((res) => {
          this.episodes = res.data.episodes
        })
        .catch(() => {
          this.isError = true
        })
        .finally(() => {
          this.isFetched = true
        })
    },
  },
})
</script>
