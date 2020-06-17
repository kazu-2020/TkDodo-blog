<template>
  <div class="episode-search-area">
    <v-row justify="end">
      <v-col cols="12" class="mt-8">
        <v-text-field
          v-model="keyword"
          label="エピソードを検索する"
          prepend-inner-icon="mdi-magnify"
          solo
          class="episode-search"
          hide-details
          :loading="loading"
          @keypress.enter="searchEpisodes"
        />
      </v-col>
      <v-col cols="3" align="right">
        <v-btn outlined>
          <v-icon>mdi-plus</v-icon>
          詳しい条件で探す
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="episodes.length !== 0" cols="12">
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
            <tbody>
              <tr v-for="episode in episodes" :key="episode.id">
                <td>
                  <v-btn
                    tile
                    small
                    color="orange"
                    class="add-button"
                    @click="addEpisode(episode)"
                  >
                    <v-icon>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </td>
                <td justify="center" align="center">
                  <v-img
                    :src="eyecatchUrl(episode.eyecatch)"
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
                  {{ convertReleaseDate(episode.releasedEvent.startDate) }}
                </td>
                <td>
                  <v-chip class="mx-2" color="pink" label text-color="white">
                    公開
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col v-else-if="isNoEpisode()" cols="12">
        <p>
          エピソードが見つかりませんでした。 <br />
          他のキーワードや条件でお探しください
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'

interface DataType {
  keyword: string
  episodes: Array<object>
  loading: boolean
}

export default Vue.extend({
  name: 'PlaylistEpisodeSearch',
  data(): DataType {
    return {
      keyword: '',
      episodes: [],
      loading: false,
    }
  },
  methods: {
    isNoEpisode() {
      return this.keyword !== '' && this.episodes.length === 0
    },
    searchEpisodes() {
      this.loading = true
      axios
        .get(`/api/episodes/search?word=${this.keyword}`)
        .then(res => {
          this.episodes = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    eyecatchUrl(eyecatch: any) {
      if (eyecatch !== undefined) {
        return eyecatch.medium.url
      } else {
        return ''
      }
    },
    convertReleaseDate(date: any) {
      return moment(date).format('YYYY年M月DD日（ddd）')
    },
    addEpisode(episode: any) {
      this.$store.dispatch('playlists/addEditingPlaylistEpisode', episode)
      this.episodes.splice(this.episodes.indexOf(episode), 1)
    },
  },
})
</script>

<style lang="scss">
.episode-search-area {
  .v-responsive.v-image.episode-image {
    border-radius: 5px;
  }
  .add-button.v-btn.v-btn--tile.v-size--small {
    min-width: 0;
    padding: 0 2px;
  }
}
</style>
