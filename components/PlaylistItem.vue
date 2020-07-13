<template>
  <v-card class="mx-auto" outlined light>
    <v-container>
      <v-row justify="space-between">
        <v-col cols="auto" class="py-2 pr-0 pl-4">
          <v-img :src="dummyImage(playlist.dateCreated)" width="140" />
        </v-col>
        <v-col class="mr-auto">
          <v-card-title class="headline mb-1">
            {{ playlist.name }}
            <v-chip
              v-if="playlist.originalSeriesId"
              class="ma-2"
              color="secondary"
              small
            >
              SeriesID: {{ playlist.originalSeriesId }}
            </v-chip>
          </v-card-title>
          <v-card-text class="card-list-item">
            公開期間:
            <span>2020/01/02 ~ 2021/10/02</span>
          </v-card-text>
          <v-card-text class="card-list-item">
            番組総時間:
            <span>{{ totalTime }}</span>
          </v-card-text>
          <v-card-text class="card-list-item">
            <v-icon>mdi-update</v-icon>
            {{ formattedDate(playlist.updated_at) }}
            更新
          </v-card-text>
        </v-col>
        <v-col cols="auto" class="text-center pl-0">
          <v-row class="flex-column ma-0 fill-height">
            <v-col class="px-0 pt-0">
              <v-btn
                small
                icon
                :to="{ name: 'playlists-id', params: { id: playlist.id } }"
                nuxt
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </v-col>
            <v-col class="px-0 pt-0">
              <v-btn small icon @click="deletePlaylist">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
            <v-col />
            <v-col />
          </v-row>
        </v-col>
      </v-row>
    </v-container>
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
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

interface DataType {
  episodePreviewNum: number
}

export default Vue.extend({
  name: 'PlaylistItem',
  props: {
    playlist: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data(): DataType {
    return {
      episodePreviewNum: 6,
    }
  },
  computed: {
    totalTime() {
      const seconds = this.playlist.totalTime % 60
      const totalMinutes = (this.playlist.totalTime - seconds) / 60
      const minutes = totalMinutes % 60
      const hours = Math.floor(totalMinutes / 60)

      return `${('00' + hours).slice(-2)}:${('00' + minutes).slice(-2)}:${(
        '00' + seconds
      ).slice(-2)}`
    },
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
    formattedDate(_time: string) {
      return moment(_time).format('YYYY/MM/DD')
    },
    deletePlaylist() {
      if (confirm('本当に削除しますか？')) {
        this.$emit('delete-playlist', this.playlist)
      }
    },
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
<style scoped>
.col.col-auto,
.col.mr-auto {
  padding: 0px 16px;
}
.v-card__title.headline {
  padding-top: 8px;
}

.v-card__text.card-list-item {
  padding-top: 0;
}
</style>
