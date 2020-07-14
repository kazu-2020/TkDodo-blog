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
    <playlist-episode-accordion :playlist="playlist" />
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import PlaylistEpisodeAccordion from '~/components/PlaylistEpisodeAccordion.vue'

interface DataType {
  episodePreviewNum: number
}

export default Vue.extend({
  name: 'PlaylistItem',
  components: {
    PlaylistEpisodeAccordion,
  },
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
