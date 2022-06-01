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
          clearable
          @keypress.enter="searchEpisodesWithKeyword"
        />
      </v-col>
      <v-col cols="3" align="right">
        <v-switch
          v-model="filterService"
          label="G or E のエピソードのみ"
          class="custom_toggle_filter"
        />
      </v-col>
      <v-col cols="4" align="right">
        <v-switch
          v-model="ignoreRange"
          label="公開範囲外のエピソードを含む"
          class="custom_toggle_filter"
        />
      </v-col>
      <v-tabs>
        <v-tab>
          <v-menu offset-y>
            <template #activator="{ on }">
              <v-btn color="transparent" depressed tile height="64" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
                プレイリスト
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="contentsTypeNum = 0">
                <v-list-item-title class="playlist_new">
                  エピソード
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="contentsTypeNum = 1">
                <v-list-item-title>シリーズ</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>プレイリスト</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-tab>
        <v-tab @click="queryKeyNum = 0">ワード</v-tab>
        <v-tab @click="queryKeyNum = 2">キーワード</v-tab>
        <v-tab @click="queryKeyNum = 1">出演者名</v-tab>
        <v-tab @click="queryKeyNum = 3">IDで探す</v-tab>
        <v-tab>
          <v-menu offset-y>
            <template #activator="{ on }">
              <v-btn color="transparent" depressed tile height="64" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
                並び順
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="sortTypeNum = 0">
                <v-list-item-title>関連スコア順</v-list-item-title>
              </v-list-item>
              <v-list-item @click="sortTypeNum = 1">
                <v-list-item-title> 新しい順</v-list-item-title>
              </v-list-item>
              <v-list-item @click="sortTypeNum = 2">
                <v-list-item-title>古い順</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-tab>
      </v-tabs>
    </v-row>
    <v-row
      id="episode-search-result"
      :class="[contentsTypeNum === 1 ? 'series-result' : '']"
    >
      <v-col v-if="episodes.length !== 0" cols="12">
        <div class="body-2 ml-1">全 {{ totalSearchResult }} 件</div>
        <v-simple-table
          v-if="contentsTypeNum === 0"
          fixed-header
          height="570px"
        >
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
                <th class="text-left" style="min-width: 130px">最終更新日</th>
              </tr>
            </thead>
            <tbody>
              <episode-search-result-table-row
                v-for="episode in episodes"
                :key="episode.id"
                :episode="episode"
                :ignore-episodes="ignoreEpisodes"
                @add-episode="addEpisode"
                @select-episode="selectEpisode(episode)"
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
                  {{ nextPageStartIndex }}-{{
                    nextPageEndIndex
                  }}件目を読み込む/全{{ totalSearchResult }}件
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-expansion-panels v-else>
          <v-expansion-panel v-for="(item, i) in 20" :key="i">
            <v-expansion-panel-header> Item </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-simple-table height="250px">
                <template #default>
                  <thead />
                  <tbody>
                    <episode-search-result-table-row
                      v-for="episode in episodes"
                      :key="episode.id"
                      :episode="episode"
                      :ignore-episodes="ignoreEpisodes"
                      @add-episode="addEpisode"
                      @select-episode="selectEpisode(episode)"
                    />
                  </tbody>
                </template>
              </v-simple-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <!--      <v-col v-else-if="isNoResult" cols="12">-->
      <!--        <v-alert text outlined color="deep-orange" icon="mdi-alert-outline">-->
      <!--          エピソードが見つかりませんでした。 <br />-->
      <!--          他のキーワードや条件でお探しください-->
      <!--        </v-alert>-->
      <!--      </v-col>-->
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
  queryKeyNum: number
  sortTypeNum: number
  contentsTypeNum: number
  ignoreRange: boolean
  filterService: boolean
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
      queryKeyNum: 0,
      sortTypeNum: 0,
      contentsTypeNum: 0,
      ignoreRange: false,
      filterService: false,
      totalSearchResult: 0,
    }
  },
  computed: {
    sortType(): string {
      switch (this.sortTypeNum) {
        case 0:
          return 'score_desc'
        case 1:
          return 'dateModified_desc'
        case 2:
          return 'dateModified_asc'
        default:
          return 'score_desc'
      }
    },
    sortTypeQuery(): string {
      const splittedSortType = this.sortType.split('_')
      return `order_by=${splittedSortType[0]}&order=${splittedSortType[1]}`
    },
    queryKey(): string {
      switch (this.queryKeyNum) {
        case 0:
          return 'word'
        case 1:
          return 'concern'
        case 2:
          return 'keyword'
        case 3:
          return 'id'
        default:
          return 'word'
      }
    },
    contentsType(): string {
      switch (this.contentsTypeNum) {
        case 0:
          return 'episode'
        case 1:
          return 'series'
        default:
          return 'episode'
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
    pageSize(): number {
      return 10
    },
    nextPageStartIndex(): number {
      return this.searchOffset + 1
    },
    nextPageEndIndex(): number {
      return Math.min(this.searchOffset + this.pageSize, this.totalSearchResult)
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
    editingKeywords: {
      handler(newVal: string | null) {
        if (newVal == null) {
          this.episodes = []
        }
      },
    },
    filterService: {
      handler() {
        this.searchEpisodesWithKeyword()
      },
    },
    ignoreRange: {
      handler() {
        this.searchEpisodesWithKeyword()
      },
    },
  },
  methods: {
    searchEpisodes({
      clearCurrentEpisodes,
    }: {
      clearCurrentEpisodes: boolean
    }) {
      this.loading = true

      if (clearCurrentEpisodes) {
        this.episodes = []
        this.searchOffset = 0
      }

      let searchUrl = `/episodes/search?${this.queryKey}=${this.editingKeywords}&offset=${this.searchOffset}&${this.sortTypeQuery}&ignore_range=${this.ignoreRange}&size=${this.pageSize}`
      if (this.filterService) {
        // FIXME: e2 を加えると BadRequest になるため、一旦除外
        searchUrl = searchUrl + '&service=g1,g2,e1,e3'
      }
      this.$axios
        .get(searchUrl)
        .then((res) => {
          this.episodes = this.episodes.concat(res.data.items)
          this.totalSearchResult = res.data.total
          this.isNoResult = this.totalSearchResult === 0
          this.searchOffset += this.pageSize
        })
        .finally(() => {
          this.loading = false
          if (this.episodes.length <= this.pageSize) {
            this.$scrollTo('#episode-search-result', 1400, {
              easing: [0, 0, 0.1, 1],
              offset: -195,
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
    selectEpisode(episode: any) {
      this.$emit('select-episode', episode)
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

.v-input.custom_toggle_filter.v-input--selection-controls.v-input--switch {
  margin-top: 0;
  margin-right: 16px;
  display: inline-block;

  label.v-label {
    font-size: 14px;
  }
}
.series-result {
  max-height: 570px;
  overflow: auto;
}
</style>
