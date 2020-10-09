<template>
  <v-sheet
    color="grey"
    style="position: relative"
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
      "
      class="pa-1 caption"
    >
      {{ caption }}
    </div>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

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
        episode.eyecatch?.medium?.url || this.dummyImage(episode.dateCreated)
      )
    },
    dummyImage(time: any): string {
      const logoNumber = (Number(moment(time).format('DD')) % 10) + 1
      return `/dummy/default${logoNumber}/default${logoNumber}-logo.png`
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
