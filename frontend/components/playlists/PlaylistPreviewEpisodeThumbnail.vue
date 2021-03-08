<template>
  <v-sheet
    color="white"
    @mouseenter="showSeriesName"
    @mouseleave="hideSeriesName"
  >
    <v-img :src="episodeThumbnailUrl(episode)" aspect-ratio="1.778" />
    <div class="pa-1 caption" style="color: black">
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
      const caption = this.isShowSeriesName
        ? this.episode.partOfSeries.name
        : this.episode.name
      return caption.length > 9 ? caption.substr(0, 8) + '…' : caption
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
  },
})
</script>
