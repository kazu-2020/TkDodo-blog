<template>
  <div class="episode-search-area">
    <v-row justify="end">
      <v-col cols="12" class="mt-8">
        <v-text-field
          v-model="editingKeywords"
          label="エピソードを検索する"
          prepend-inner-icon="mdi-magnify"
          solo
          class="episode-search"
          hide-details
          :loading="loading"
          @keypress.enter="searchEpisodesWithKeyword"
        />
      </v-col>
      <v-col cols="8" align="right" class="search_detail">
        <v-switch
          v-model="ignoreRange"
          label="公開範囲外のエピソードを含む"
          class="ignore_range"
        />
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
                <v-btn-toggle v-model="sortTypeNum">
                  <v-btn>関連スコア順</v-btn>
                  <v-btn>新しい順</v-btn>
                  <v-btn>古い順</v-btn>
                </v-btn-toggle>
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-spacer />
              <v-btn color="secondary" text @click="searchWithDetail">
                この条件で検索
              </v-btn>
              <v-btn text @click="clearSearchPane"> 検索条件をクリア </v-btn>
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
                <th class="text-left">エピソード</th>
                <th />
                <th class="text-left">エピソードID</th>
                <th class="text-left">シリーズ名</th>
                <th class="text-left">シリーズID</th>
                <th class="text-left">直近放送日</th>
                <th class="text-left">視聴可能</th>
              </tr>
            </thead>
            <tbody>
              <episode-search-result-table-row
                v-for="episode in episodes"
                :key="episode.id"
                :episode="episode"
                :ignore-episodes="ignoreEpisodes"
                @add-episode="addEpisode"
              />
              <tr v-show="canLoadMoreEpisodes">
                <td
                  colspan="8"
                  align="center"
                  class="load-more"
                  @click="searchAdditionalEpisodes"
                >
                  <v-progress-circular
                    v-if="loading"
                    indeterminate
                    color="amber"
                    class="mr-4"
                  />
                  さらに読み込む
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
import EpisodeSearchResultTableRow from '~/components/playlists/EpisodeSearchResultTableRow.vue'

interface DataType {
  episodes: Array<object>
  loading: boolean
  isNoResult: boolean
  searchOffset: number
  menu: boolean
  sortTypeNum: number
  ignoreRange: boolean
  totalSearchResult: number
}

export default Vue.extend({
  name: 'PlaylistEpisodeSearch',
  components: {
    EpisodeSearchResultTableRow,
  },
  props: {
    ignoreEpisodes: {
      type: Array,
      required: false,
      default: () => [],
    },
    keywords: {
      type: String,
      required: false,
      default: '',
    },
    searchTriggerCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data(): DataType {
    return {
      episodes: [],
      loading: false,
      isNoResult: false,
      searchOffset: 0,
      menu: false,
      sortTypeNum: 0,
      ignoreRange: false,
      totalSearchResult: 0,
    }
  },
  computed: {
    sortType(): string {
      switch (this.sortTypeNum) {
        case 0:
          return 'scoreDesc'
        case 1:
          return 'dateDesc'
        case 2:
          return 'dateAsc'
        default:
          return 'scoreDesc'
      }
    },
    canLoadMoreEpisodes(): boolean {
      return this.searchOffset < this.totalSearchResult
    },
    editingKeywords: {
      get() {
        return this.keywords
      },
      set(value) {
        this.$emit('update:keywords', value)
      },
    },
  },
  watch: {
    searchTriggerCount: {
      handler(newVal: Number) {
        if (newVal === 0) return
        this.searchEpisodesWithKeyword()
      },
      immediate: true,
    },
  },
  methods: {
    searchEpisodes({
      clearCurrentEpisodes,
    }: {
      clearCurrentEpisodes: boolean
    }) {
      this.loading = true
      const pageSize = 10

      if (clearCurrentEpisodes) {
        this.episodes = []
        this.searchOffset = 0
      }
      this.$axios
        .get(
          `/episodes/search?word=${this.editingKeywords}&offset=${this.searchOffset}&sort_type=${this.sortType}&ignore_range=${this.ignoreRange}&size=${pageSize}`
        )
        .then((res) => {
          this.episodes = this.episodes.concat(res.data.items)
          this.totalSearchResult = res.data.total
          this.isNoResult = this.totalSearchResult === 0
          this.searchOffset += pageSize
        })
        .finally(() => {
          this.loading = false
          if (this.episodes.length <= pageSize) {
            this.$scrollTo('#episode-search-result', 1400, {
              easing: [0, 0, 0.1, 1],
              offset: -75,
            })
          }
        })
    },
    searchEpisodesWithKeyword() {
      this.searchEpisodes({ clearCurrentEpisodes: true })
    },
    addEpisode(episode: any) {
      this.episodes.splice(this.episodes.indexOf(episode), 1)
      this.$emit('add-episode', episode)
    },
    searchWithDetail() {
      this.menu = false
      this.searchEpisodesWithKeyword()
    },
    clearSearchPane() {
      this.menu = false
      this.editingKeywords = ''
      this.episodes = []
    },
    searchAdditionalEpisodes() {
      this.searchEpisodes({ clearCurrentEpisodes: false })
    },
  },
})
</script>

<style lang="scss">
.episode-search-area {
  .load-more {
    cursor: pointer;
  }
}

.search_detail {
  position: relative;
}

.v-input.ignore_range.v-input--selection-controls.v-input--switch {
  position: absolute;
  top: 12px;
  right: 192px;
  margin-top: 0;
  margin-right: 16px;
  display: inline-block;
  width: 280px;
}
</style>
