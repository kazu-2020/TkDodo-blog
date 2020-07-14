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
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn outlined v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>
              詳しい条件で探す
            </v-btn>
          </template>

          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-title>並び順</v-list-item-title>
                <v-btn-toggle v-model="dateOrder">
                  <v-btn>新しい順</v-btn>
                  <v-btn>古い順</v-btn>
                </v-btn-toggle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>
                  放送期間外のエピソードを含む
                </v-list-item-title>
                <v-switch v-model="ignoreRange" />
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-spacer />
              <v-btn color="secondary" text @click="searchWithDetail">
                この条件で検索
              </v-btn>
              <v-btn text @click="clearSearchPane">
                検索条件をクリア
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
    <v-row id="episode-search-result">
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
                    v-if="!shouldIgnoreEpisode(episode)"
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
                  <div v-else>
                    追加済み
                  </div>
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
      <v-col v-else-if="isNoResult" cols="12">
        <v-alert text outlined color="deep-orange" icon="mdi-alert-outline">
          エピソードが見つかりませんでした。 <br />
          他のキーワードや条件でお探しください
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

interface DataType {
  keyword: string
  episodes: Array<object>
  loading: boolean
  isNoResult: boolean
  menu: boolean
  dateOrder: number
  ignoreRange: boolean
  totalSearchResult: number
}

export default Vue.extend({
  name: 'PlaylistEpisodeSearch',
  props: {
    ignoreEpisodes: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data(): DataType {
    return {
      keyword: '',
      episodes: [],
      loading: false,
      isNoResult: false,
      menu: false,
      dateOrder: 0,
      ignoreRange: true,
      totalSearchResult: 0,
    }
  },
  methods: {
    searchEpisodes() {
      this.loading = true
      this.$axios
        .get(`/api/episodes/search?word=${this.keyword}`)
        .then(res => {
          this.episodes = res.data.items
          this.totalSearchResult = res.data.total
          this.isNoResult = this.episodes.length === 0
        })
        .finally(() => {
          this.loading = false
          this.$scrollTo('#episode-search-result', 1400, {
            easing: [0, 0, 0.1, 1],
            offset: -75,
          })
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
    shouldIgnoreEpisode(episode: any): boolean {
      return this.ignoreEpisodes.map((ep: any) => ep.id).includes(episode.id)
    },
    searchWithDetail() {
      this.menu = false
    },
    clearSearchPane() {
      this.menu = false
      this.keyword = ''
      this.episodes = []
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
