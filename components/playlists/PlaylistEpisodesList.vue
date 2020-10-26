<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th />
          <th class="text-left">エピソード</th>
          <th />
          <th class="text-left">エピソードID</th>
          <th class="text-left">シリーズ名</th>
          <th class="text-left">シリーズID</th>
          <th class="text-left">直近放送日</th>
          <th class="text-left">視聴可能</th>
        </tr>
      </thead>
      <draggable v-model="items" tag="tbody">
        <tr v-for="item in items" :key="item.id">
          <td>
            <v-btn
              tile
              small
              color="orange"
              class="delete-button"
              @click="deleteEpisode(item)"
            >
              <v-icon> mdi-minus </v-icon>
            </v-btn>
          </td>
          <td justify="center" align="center">
            <v-img
              :src="eyecatchUrl(item.eyecatch)"
              lazy-src="https://placehold.jp/50x28.png"
              width="50"
              class="ma-2 episode-image"
            />
          </td>
          <td align="left">
            {{ item.name }}
          </td>
          <td>{{ item.id }}</td>
          <td>{{ seriesName(item) }}</td>
          <td>{{ seriesId(item) }}</td>
          <td>
            {{ convertReleaseDate(item.releasedEvent) }}
          </td>
          <td>
            <v-chip class="mx-2" color="pink" label text-color="white">
              視聴可
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
    eyecatchUrl(eyecatch: any) {
      if (eyecatch !== undefined) {
        return eyecatch.medium.url
      } else {
        return ''
      }
    },
    seriesName(episode: any) {
      return episode?.partOfSeries?.name || ''
    },
    seriesId(episode: any) {
      return episode?.partOfSeries?.id || ''
    },
  },
})
</script>

<style lang="scss" scoped>
.v-responsive.v-image.episode-image {
  border-radius: 5px;
}

.delete-button.v-btn.v-btn--tile.v-size--small {
  min-width: 0;
  padding: 0 2px;
}
</style>
