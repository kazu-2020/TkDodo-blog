<template>
  <div class="height-100">
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
          <v-col
            v-for="episode in _episodes"
            :key="episode.id"
            cols="3"
            class="py-0"
          >
            <v-sheet color="grey" style="position: relative">
              <v-img :src="episodeThumbnailUrl(episode)" aspect-ratio="1.33" />
              <div
                style="
                  background: rgba(0, 0, 0, 0.6);
                  position: absolute;
                  bottom: 0;
                  width: 100%;
                "
                class="pa-1 caption"
              >
                {{ episode.partOfSeries.name }}
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

interface DataType {
  episodePreviewNum: number
  episodes: object[]
  isError: boolean
  isFetched: boolean
}

export default Vue.extend({
  name: 'PlaylistEpisodesCarousel',
  props: {
    playlist: {
      type: Object,
      required: true,
    },
  },
  data(): DataType {
    return {
      episodePreviewNum: 4,
      episodes: [],
      isError: false,
      isFetched: false,
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
  mounted() {
    this.fetchEpisodes()
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
        .get(`/playlists/${this.playlist.id}/playlist_episodes`)
        .then((res) => {
          this.episodes = res.data.items
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

<style lang="scss" scoped>
.height-100 {
  height: 100%;
}
</style>
