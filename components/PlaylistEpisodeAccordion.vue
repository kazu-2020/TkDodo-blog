<template>
  <v-expansion-panels :disabled="playlist.episodeNum === 0">
    <v-expansion-panel>
      <v-expansion-panel-header>
        エピソード ({{ playlist.episodeNum }})
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-carousel hide-delimiters height="auto" :show-arrows="isShowArrows">
          <v-carousel-item
            v-for="(episodes, index) in splittedEpisodes"
            :key="`splittedEpisode${index}`"
          >
            <v-row class="px-4">
              <v-col v-for="episode in episodes" :key="episode.id" cols="4">
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
    }
  },
  computed: {
    splittedEpisodes(): any {
      if (this.playlist.items === undefined) return []

      const array = this.playlist.items.slice(0, this.playlist.items.length)
      const result = []
      let index = 0

      while (index < this.playlist.items.length) {
        result.push(array.splice(0, this.episodePreviewNum))
        index = index + this.episodePreviewNum
      }

      return result
    },
    isShowArrows(): boolean {
      return (this.playlist.items?.length || 0) > this.episodePreviewNum
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
  },
})
</script>
