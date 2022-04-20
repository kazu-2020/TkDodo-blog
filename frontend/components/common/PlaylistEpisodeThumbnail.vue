<template>
  <v-sheet
    color="grey"
    style="position: relative; border-radius: 4px; overflow: hidden"
    @mouseenter="showSeriesName"
    @mouseleave="hideSeriesName"
  >
    <v-img :src="episodeThumbnailUrl(episode)" aspect-ratio="1.33" />
    <div
      style="
        background: rgba(0, 0, 0, 0.6);
        position: absolute;
        bottom: 0;
        width: 100%;
        color: white;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      "
      class="pa-1 caption"
    >
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
  name: 'PlaylistEpisodeThumbnail',
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
      return (
        episode.eyecatch?.medium?.url ||
        this.episode.partOfSeries.eyecatch?.medium?.url
      )
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
