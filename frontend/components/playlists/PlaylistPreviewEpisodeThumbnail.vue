<template>
  <v-sheet
    color="white"
    @mouseenter="showSeriesName"
    @mouseleave="hideSeriesName"
  >
    <v-img :src="episodeThumbnailUrl(episode)" aspect-ratio="1.778">
      <div class="no-video" v-if="!hasVideo(episode)">
        <div class="no-video-text">視聴不可</div>
      </div>
    </v-img>
    <div class="py-1 caption" style="color: black">
      {{ caption }}
    </div>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
  isShowSeriesName: boolean
}

export default Vue.extend({
  name: 'PlaylistPreviewEpisodeThumbnail',
  props: {
    episode: {
      type: Object,
      required: true,
    },
  },
  data(): DataType {
    return {
      isShowSeriesName: false,
    }
  },
  computed: {
    caption(): string {
      return this.isShowSeriesName
        ? this.episode.partOfSeries.name
        : this.episode.name
    },
  },
  methods: {
    episodeThumbnailUrl(episode: any): string {
      return episode.eyecatch?.medium?.url || 'https://placehold.jp/71x40.png'
    },
    showSeriesName(): void {
      this.isShowSeriesName = true
    },
    hideSeriesName(): void {
      this.isShowSeriesName = false
    },
    hasVideo(episode: any) {
      const broadcastEventId = episode?.detailedRecentEvent?.id
      if (broadcastEventId === undefined) {
        return false
      }

      const broadcastEvent = episode.broadcastEvent.find(
        (be: any) => be.id === broadcastEventId
      )

      const videos = broadcastEvent?.video || []
      const okushibuVideo = videos.find(
        (video: any) => video.identifierGroup?.environmentId === 'okushibu'
      )
      return !!okushibuVideo
    },
  },
})
</script>

<style lang="scss" scoped>
.no-video {
  position: absolute;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
  font-weight: bold;
  width: 100%;
  height: 100%;
  font-size: 12px;
  display: table;
}
.no-video-text {
  height: 100%;
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
</style>
