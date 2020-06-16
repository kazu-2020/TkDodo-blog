<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th />
          <th class="text-left">
            エピソード
          </th>
          <th />
          <th class="text-left">
            エピソードID
          </th>
          <th class="text-left">
            シリーズ名
          </th>
          <th class="text-left">
            シリーズID
          </th>
          <th class="text-left">
            直近放送日
          </th>
          <th class="text-left">
            公開状況
          </th>
        </tr>
      </thead>
      <draggable v-model="episodes" tag="tbody">
        <tr v-for="episode in episodes" :key="episode.id">
          <td>
            <v-btn
              tile
              small
              color="orange"
              class="delete-button"
              @click="deleteEpisode(episode)"
            >
              <v-icon>
                mdi-minus
              </v-icon>
            </v-btn>
          </td>
          <td justify="center" align="center">
            <v-img
              :src="episode.eyecatch.medium.url"
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
            {{ convertReleaseDate(episode.releasedEvent.startDate) }}
          </td>
          <td>
            <v-chip class="mx-2" color="pink" label text-color="white">
              公開
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
      default: () => [],
    },
  },
  methods: {
    convertReleaseDate(date: any) {
      return moment(date).format('YYYY年M月DD日（ddd）')
    },
    deleteEpisode(episode: any) {
      this.$store.dispatch('playlists/deleteEditingPlaylistEpisode', episode)
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
