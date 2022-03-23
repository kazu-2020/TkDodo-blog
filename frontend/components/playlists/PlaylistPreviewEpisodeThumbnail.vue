<template>
  <v-sheet
    color="white"
    @mouseenter="showSeriesName"
    @mouseleave="hideSeriesName"
  >
    <v-img :src="episodeThumbnailUrl(episode)" aspect-ratio="1.778">
      <div v-if="!hasVideo(episode)" class="no-video">
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
import ParseVideoHelper from '~/utils/ParseVideoHelper'

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
    episodeThumbnailUrl(item: any): string {
      if (item?.eyecatch !== undefined) {
        return item.eyecatch.medium.url
      } else if ((item?.keyvisuals || [])[0] !== undefined) {
        return item.keyvisuals[0].small.url
      } else if (item?.partOfSeries?.eyecatch !== undefined) {
        return item.partOfSeries.eyecatch.medium.url
      }

      return 'https://placehold.jp/71x40.png'
    },
    showSeriesName(): void {
      this.isShowSeriesName = true
    },
    hideSeriesName(): void {
      this.isShowSeriesName = false
    },
    hasVideo(episode: any) {
      const videos = episode?.videos || []
      return ParseVideoHelper.hasVideo(videos)
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
