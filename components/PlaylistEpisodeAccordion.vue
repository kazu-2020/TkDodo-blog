<template>
  <v-expansion-panels :disabled="playlist.episodeNum === 0">
    <v-expansion-panel>
      <v-expansion-panel-header @click="fetchEpisodes">
        エピソード ({{ playlist.episodeNum }})
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div v-if="episodes.length === 0" align="center">
          <v-progress-circular indeterminate color="amber" />
        </div>
        <v-carousel
          v-else
          hide-delimiters
          height="auto"
          :show-arrows="isShowArrows"
        >
          <v-carousel-item
            v-for="(_episodes, index) in splittedEpisodes"
            :key="`splittedEpisode${index}`"
          >
            <v-row class="px-4">
              <v-col v-for="episode in _episodes" :key="episode.id" cols="4">
                <v-sheet color="grey" style="position: relative;">
                  <v-img
                    :src="episodeThumbnailUrl(episode)"
                    aspect-ratio="1.33"
                  />
                  <div
                    style="background-color: black; opacity: .5; position: absolute; bottom: 0; width: 100%;"
                    class="pa-1 caption"
                  >
                    {{ episode.partOfSeries.name }}
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

interface DataType {
  episodePreviewNum: number
  episodes: object[]
}

export default Vue.extend({
  name: 'PlaylistEpisodeAccordion',
  props: {
    playlist: {
      type: Object,
      required: true,
    },
  },
  data(): DataType {
    return {
      episodePreviewNum: 6,
      episodes: [],
    }
  },
  computed: {
    splittedEpisodes(): any {
      if (this.episodes.length === 0) return []

      const array = this.episodes.slice(0, this.episodes.length)
      const result = []
      let index = 0

      while (index < this.episodes.length) {
        result.push(array.splice(0, this.episodePreviewNum))
        index = index + this.episodePreviewNum
      }

      return result
    },
    isShowArrows(): boolean {
      return (this.episodes?.length || 0) > this.episodePreviewNum
    },
  },
  methods: {
    episodeThumbnailUrl(episode: any) {
      return (
        episode.eyecatch?.medium?.url || this.dummyImage(episode.dateCreated)
      )
    },
    dummyImage(time: any) {
      const logoNumber = (Number(moment(time).format('DD')) % 10) + 1
      return `/dummy/default${logoNumber}/default${logoNumber}-logo.png`
    },
    fetchEpisodes() {
      if (this.episodes.length !== 0) return

      this.$axios
        .get(`/api/playlists/${this.playlist.id}/playlist_episodes`)
        .then(res => {
          this.episodes = res.data.items
        })
    },
  },
})
</script>
