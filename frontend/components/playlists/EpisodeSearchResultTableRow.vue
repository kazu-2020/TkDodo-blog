<template>
  <tr class="result_row" style="cursor: pointer" @click.stop="clickEpisode">
    <td>
      <v-btn
        v-if="!shouldIgnoreEpisode"
        tile
        small
        color="orange"
        class="add_button"
        @click="addEpisode(episode)"
      >
        <v-icon> mdi-plus </v-icon>
      </v-btn>
      <div v-else>追加済み</div>
    </td>
    <td justify="center" align="center">
      <v-img
        :src="eyecatchUrl"
        lazy-src="https://placehold.jp/50x28.png"
        width="50"
        class="ma-2 episode-image"
      />
    </td>
    <td align="left">
      {{ episode.name }}
    </td>
    <td>{{ totalTime(episode) }}</td>
    <td>{{ episode.partOfSeries.name }}</td>
    <td>
      {{ releaseDate }}
    </td>
    <td>
      <v-chip
        v-if="hasVideo(episode)"
        class="mx-2"
        color="pink"
        label
        text-color="white"
        >視聴可</v-chip
      >
      <v-chip v-else class="mx-2" color="grey" label text-color="white"
        >視聴不可</v-chip
      >
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

moment.locale('ja')

export default Vue.extend({
  name: 'EpisodeSearchResultTableRow',
  props: {
    episode: {
      type: Object,
      required: true,
    },
    ignoreEpisodes: {
      type: Array,
      required: true,
    },
  },
  computed: {
    shouldIgnoreEpisode(): boolean {
      return this.ignoreEpisodes
        .map((ep: any) => ep.id)
        .includes(this.episode.id)
    },
    eyecatchUrl(): string {
      if (this.episode.eyecatch !== undefined) {
        return this.episode.eyecatch.medium.url
      } else {
        return 'https://placehold.jp/50x28.png'
      }
    },
    releaseDate(): string {
      const date = this.episode.releasedEvent?.startDate
      if (date) {
        return moment(date).format('YYYY年M月DD日（ddd）')
      } else {
        return '未設定'
      }
    },
  },
  methods: {
    addEpisode(episode: any): void {
      this.$emit('add-episode', episode)
    },
    totalTime(episode: any) {
      if (episode.detailedRecentEvent === undefined) return '--:--:--'
      const startDate = moment(episode.detailedRecentEvent.startDate)
      const endDate = moment(episode.detailedRecentEvent.endDate)
      const totalSecond = endDate.diff(startDate) / 1000

      const seconds = totalSecond % 60
      const totalMinutes = (totalSecond - seconds) / 60
      const minutes = totalMinutes % 60
      const hours = Math.floor(totalMinutes / 60)

      return `${('00' + hours).slice(-2)}:${('00' + minutes).slice(-2)}:${(
        '00' + seconds
      ).slice(-2)}`
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
    clickEpisode() {
      this.$emit('select-episode', this.episode)
    },
  },
})
</script>

<style lang="scss">
.result_row {
  .v-responsive.v-image.episode-image {
    border-radius: 2px;
  }
  .add_button.v-btn.v-btn--tile.v-size--small {
    min-width: 0;
    padding: 0 2px;
  }
}
</style>
