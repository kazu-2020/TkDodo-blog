<template>
  <v-simple-table>
    <template #default>
      <thead>
        <tr>
          <th />
          <th class="text-left">エピソード</th>
          <th />
          <th class="text-left">再生時間</th>
          <th class="text-left">シリーズ名</th>
          <th class="text-left" style="min-width: 180px">直近放送日</th>
          <th class="text-left">視聴可能</th>
        </tr>
      </thead>
      <draggable v-model="items" tag="tbody">
        <tr
          v-for="item in items"
          :key="item.id"
          style="cursor: pointer"
          @click.stop="clickEpisode(item)"
        >
          <td>
            <v-btn
              tile
              small
              color="orange"
              class="delete-button"
              @click.stop="deleteEpisode(item)"
            >
              <v-icon> mdi-minus </v-icon>
            </v-btn>
          </td>
          <td justify="center" align="center">
            <v-img
              :src="eyecatchUrl(item)"
              lazy-src="https://placehold.jp/71x40.png"
              width="71"
              class="ma-2 episode-image"
            />
          </td>
          <td align="left">
            {{ item.name }}
          </td>
          <td>{{ totalTime(item) }}</td>
          <td>{{ seriesName(item) }}</td>
          <td>
            {{ convertReleaseDate(item.releasedEvent) }}
          </td>
          <td>
            <v-chip
              v-if="hasVideo(item)"
              class="mx-2"
              color="pink"
              label
              text-color="white"
            >
              視聴可
            </v-chip>
            <v-chip v-else class="mx-2" color="grey" label text-color="white">
              視聴不可
            </v-chip>
          </td>
        </tr>
      </draggable>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import draggable from 'vuedraggable'

export default Vue.extend({
  name: 'PlaylistEpisodesList',
  components: {
    draggable,
  },
  props: {
    episodes: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  computed: {
    items: {
      get(): any[] {
        return this.episodes
      },
      set(value: any) {
        this.$emit('update-episodes', value)
      },
    },
  },
  methods: {
    clickEpisode(item: any) {
      this.$emit('select-episode', item)
    },
    convertReleaseDate(releasedEvent: any) {
      if (releasedEvent) {
        return moment(releasedEvent.startDate).format('YYYY年M月DD日（ddd）')
      } else {
        return ''
      }
    },
    deleteEpisode(episode: any) {
      this.$emit('delete-episode', episode)
    },
    eyecatchUrl(item: any) {
      if (item?.eyecatch !== undefined) {
        return item.eyecatch.medium.url
      }
      if (item?.partOfSeries?.eyecatch !== undefined) {
        return item.partOfSeries.eyecatch.medium.url
      }

      return 'https://placehold.jp/71x40.png'
    },
    seriesName(episode: any) {
      return episode?.partOfSeries?.name || ''
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
      const videos = episode?.videos || []
      const okushibuVideo = videos.find(
        (video: any) => video.identifierGroup?.environmentId === 'okushibu'
      )
      return !!okushibuVideo
    },
  },
})
</script>

<style lang="scss" scoped>
.delete-button.v-btn.v-btn--tile.v-size--small {
  min-width: 0;
  padding: 0 2px;
}
</style>
