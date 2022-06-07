<template>
  <div
    class="pa-2"
    :style="`border-top: 4px solid ${primaryColor}`"
    style="background-color: #f1f0ed"
  >
    <v-img :src="logoImageUrl" aspect-ratio="1" class="mb-2" />
    <nuxt-link
      class="body-2 playlist_title mb-2"
      :to="`/playlists/${playlist.playlistUId}`"
      style="text-decoration: none; font-weight: bold"
    >
      {{ playlist.name }}
    </nuxt-link>
    <div v-if="episodes.length === 0" align="center" class="height-100">
      <v-row v-if="isError" align="center" justify="center"
        ><v-col class="body-2">エラーが発生しました</v-col></v-row
      >
      <v-row v-else-if="isFetched" align="center" justify="center"
        ><v-col class="body-2">プレイリストはありません</v-col></v-row
      >
      <v-row v-else align="center" justify="center"
        ><v-col><v-progress-circular indeterminate color="amber" /></v-col
      ></v-row>
    </div>
    <div v-else>
      <div
        v-for="episode in episodes"
        :key="`deck-playlist-list-item-ep-${episode.id}`"
      >
        <playlist-episode-thumbnail :episode="episode" class="mb-2" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PlaylistEpisodeThumbnail from '~/components/common/PlaylistEpisodeThumbnail.vue'
import DummyImageHelper from '~/utils/DummyImageHelper'

interface DataType {
  episodes: object[]
  isError: boolean
  isFetched: boolean
}

export default Vue.extend({
  components: {
    PlaylistEpisodeThumbnail,
  },
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
  computed: {
    logoImageUrl(): string {
      return (
        this.playlist.logo?.medium?.url ||
        DummyImageHelper.getPath(this.playlist.dateCreated, 'logo')
      )
    },
    primaryColor(): string {
      return this.playlist.style.primaryLight
    },
  },
  mounted() {
    this.fetchEpisodes()
  },
  methods: {
    fetchEpisodes() {
      if (this.episodes.length !== 0) return

      this.$axios
        .get(`/playlists/${this.playlist.playlistUId}/playlist_items`)
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

<style scoped>
.playlist_title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  line-height: 1.5em;
  max-height: 4.5em;
}
</style>
