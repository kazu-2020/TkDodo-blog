<template>
  <v-card class="mb-4" outlined light>
    <v-list-item three-line>
      <v-list-item-avatar tile size="140" horizontal>
        <v-img :src="dummyImage(playlist.dateCreated)" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">
          {{ playlist.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          公開期間:
          <span>2020/01/02 ~ 2021/10/02</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          番組総時間:
          <span>{{ totalTime }}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-icon>mdi-update</v-icon>
          {{ formattedDate(playlist.updated_at) }}
          更新
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-card-actions>
        <v-btn
          outlined
          x-small
          :to="{ name: 'playlists-id', params: { id: playlist.id } }"
          nuxt
        >
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
        <v-btn outlined x-small @click="deletePlaylist">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </v-card-actions>
    </v-list-item>
    <v-expansion-panels>
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
      console.log(this.dummyImage(episode.dateCreated))
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
.v-list-item {
  position: relative;
}

.v-card__actions {
  position: absolute;
  top: 0;
  right: 0;
}

.v-btn:not(.v-btn--round).v-size--x-small {
  min-width: 0;
  width: 35px;
  height: 35px;
}

.v-application--is-ltr
  .v-list-item__avatar.v-list-item__avatar--horizontal:first-child {
  margin-top: 0px;
  margin-left: -16px;
  margin-bottom: 0;
}

.v-avatar.v-list-item__avatar.v-list-item__avatar--horizontal.v-avatar--tile.grey {
  border-top-left-radius: 3px;
  -webkit-border-top-left-radius: 3px;
  -moz-border-radius-topleft: 3px;
  border-bottom-left-radius: 3px;
  -webkit-border-bottom-left-radius: 3px;
  -moz-border-radius-bottomleft: 3px;
}
</style>
