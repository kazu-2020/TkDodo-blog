<template>
  <div class="height-100 pt-1">
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
    <v-carousel v-else hide-delimiters height="150" :show-arrows="isShowArrows">
      <v-carousel-item
        v-for="(_episodes, index) in splittedEpisodes"
        :key="`splittedEpisode${index}`"
      >
        <v-row class="py-4">
          <v-col
            v-for="episode in _episodes"
            :key="episode.id"
            :cols="cols"
            class="py-0"
          >
            <playlist-preview-episode-thumbnail :episode="episode" />
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PlaylistPreviewEpisodeThumbnail from '~/components/playlists/PlaylistPreviewEpisodeThumbnail.vue'

interface DataType {
  episodePreviewNum: number
  episodes: object[]
  isError: boolean
  isFetched: boolean
}

export default Vue.extend({
  name: 'PlaylistPreviewEpisodesCarousel',
  components: {
    PlaylistPreviewEpisodeThumbnail,
  },
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
    cols(): number {
      return 12 / this.episodePreviewNum
    },
  },
  mounted() {
    this.fetchEpisodes()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    fetchEpisodes() {
      if (this.episodes.length !== 0) return

      this.$axios
        .get(`/playlists/${this.playlist.id}/playlist_items`)
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
    handleResize() {
      if (window.innerWidth < 950) {
        this.episodePreviewNum = 4
      } else {
        this.episodePreviewNum = 6
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.height-100 {
  height: 100%;
}
</style>
