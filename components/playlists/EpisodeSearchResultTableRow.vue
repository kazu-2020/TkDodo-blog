<template>
  <tr>
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
    <td>{{ episode.id }}</td>
    <td>{{ episode.partOfSeries.name }}</td>
    <td>{{ episode.partOfSeries.id }}</td>
    <td>
      {{ releaseDate }}
    </td>
    <td>
      <v-chip class="mx-2" color="pink" label text-color="white"> 公開 </v-chip>
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
        return ''
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
  },
})
</script>

<style lang="scss">
.episode-search-area {
  .v-responsive.v-image.episode-image {
    border-radius: 5px;
  }
  .add_button.v-btn.v-btn--tile.v-size--small {
    min-width: 0;
    padding: 0 2px;
  }
}
</style>
