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
          @keypress.enter="searchWithKeyword"
        />
      </v-col>
      <v-col cols="7">
        <v-tabs>
          <v-tab class="pl-0 pr-0" style="width: 115px">
            <v-menu offset-y>
              <template #activator="{ on }">
                <v-btn
                  color="transparent"
                  depressed
                  tile
                  class="pl-0 pr-0"
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                  <span>{{ displayContentsName }}</span>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  @click="
                    searchEpisodes({
                      clearCurrentResults: true,
                      isSwitchTab: true,
                    })
                  "
                >
                  <v-list-item-title> エピソード </v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="
                    searchSeries({
                      clearCurrentResults: true,
                      isSwitchTab: true,
                    })
                  "
                >
                  <v-list-item-title> シリーズ </v-list-item-title>
                </v-list-item>
                <v-list-item @click="searchPlaylists">
                  <v-list-item-title> プレイリスト </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-tab>
          <v-tab @click="searchWithKeyword(true, true, 0)">ワード</v-tab>
          <v-tab @click="searchWithKeyword(true, true, 2)">キーワード</v-tab>
          <v-tab @click="searchWithKeyword(true, true, 1)">出演者名</v-tab>
          <v-tab
            v-if="contentsTypeNum === 0"
            class="pl-0 pr-0"
            style="width: 115px"
          >
            <v-menu offset-y>
              <template #activator="{ on }">
                <v-btn
                  class="pl-0 pr-0"
                  color="transparent"
                  depressed
                  tile
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                  {{ sortItem }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  @click="
                    searchWithKeyword(((sortTypeNum = 0), (sortItemNum = 1)))
                  "
                >
                  <v-list-item-title>関連スコア順</v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="
                    searchWithKeyword(((sortTypeNum = 1), (sortItemNum = 2)))
                  "
                >
                  <v-list-item-title> 新しい順</v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="
                    searchWithKeyword(((sortTypeNum = 2), (sortItemNum = 3)))
                  "
                >
                  <v-list-item-title>古い順</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col
        class="pt-5"
        align="right"
        :class="[contentsTypeNum === 2 ? 'col col-5' : 'col col-2']"
      >
        <v-switch
          v-model="filterService"
          label="G or E のエピソードのみ"
          class="custom_toggle_filter"
        />
      </v-col>
      <v-col v-if="contentsTypeNum !== 2" class="pt-5" cols="3" align="right">
        <v-switch
          v-model="ignoreRange"
          label="公開範囲外のエピソードを含む"
          class="custom_toggle_filter"
        />
      </v-col>
    </v-row>
    <v-row id="episode-search-result" class="search-result-table">
      <v-col
        v-if="
          episodes.length !== 0 || series.length !== 0 || playlists.length !== 0
        "
        cols="12"
      >
        <div
          class="body-2 ml-1"
          :class="[
            this.contentsTypeNum === 1 || this.contentsTypeNum === 2
              ? 'pb-6'
              : '',
          ]"
        >
          全 {{ totalSearchResult }} 件
        </div>
        <v-simple-table v-if="contentsTypeNum === 0" fixed-header>
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
                  @click="searchAdditionalResults"
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
        <v-expansion-panels v-else-if="contentsTypeNum === 1">
          <v-expansion-panel
            v-for="part_of_series in series"
            :key="part_of_series.id"
          >
            <v-expansion-panel-header expand-icon="mdi-menu-down">
              <td class="series-image">
                <v-img
                  :src="logoUrl(part_of_series)"
                  lazy-src="https://placehold.jp/40x40.png"
                  width="49"
                  height="49"
                  class="ma-2 series-image"
                />
              </td>
              <td class="series-name">
                {{ part_of_series.name }}
              </td>
              <td class="series-can-be-watch">
                視聴可能：
                <v-chip
                  v-if="isIncludeAvailableVideo(part_of_series)"
                  class="mx-2"
                  color="pink"
                  label
                  text-color="white"
                  >視聴可</v-chip
                >
                <v-chip
                  v-else
                  class="mx-2"
                  color="grey"
                  label
                  text-color="white"
                  >視聴不可</v-chip
                >
              </td>
              <span color="blue" class="display-episode">エピソード表示</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <episode-search-result-table
                :search-result="part_of_series"
                :ignore-episodes="ignoreEpisodes"
                :query-key="queryKey"
                :editing-keywords="editingKeywords"
                :sort-type-query="sortTypeQuery"
                :ignore-range="ignoreRange"
                :contents-type="contentsType"
                :filter-service="filterService"
                :total-search-episodes-result="part_of_series.episodes.count"
                @add-episode="addEpisode"
                @select-episode="selectEpisode"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <div
            v-show="canLoadMoreEpisodes"
            colspan="8"
            align="center"
            class="load-more pt-3 pb-3"
            @click="searchAdditionalResults"
          >
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="amber"
              class="mr-4"
            />
            {{ nextPageStartIndex }}-{{ nextPageEndIndex }}件目を読み込む/全{{
              totalSearchResult
            }}件
          </div>
        </v-expansion-panels>
        <v-expansion-panels v-else-if="contentsTypeNum === 2">
          <v-expansion-panel
            v-for="part_of_playlist in playlists"
            :key="part_of_playlist.id"
          >
            <v-expansion-panel-header expand-icon="mdi-menu-down">
              <td class="playlist-image">
                <v-img
                  :src="logoUrl(part_of_playlist)"
                  lazy-src="https://placehold.jp/40x40.png"
                  width="49"
                  height="49"
                  class="ma-2 playlist-image"
                />
              </td>
              <td class="playlist-name">
                {{ part_of_playlist.name }}
              </td>
              <td class="series-can-be-watch">
                視聴可能：
                <v-chip
                  v-if="isIncludeAvailableVideo(part_of_playlist)"
                  class="mx-2"
                  color="pink"
                  label
                  text-color="white"
                  >視聴可</v-chip
                >
                <v-chip
                  v-else
                  class="mx-2"
                  color="grey"
                  label
                  text-color="white"
                  >視聴不可</v-chip
                >
              </td>
              <span color="blue" class="display-episode">エピソード表示</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <episode-search-result-table
                :search-result="part_of_playlist"
                :ignore-episodes="ignoreEpisodes"
                :query-key="queryKey"
                :editing-keywords="editingKeywords"
                :sort-type-query="sortTypeQuery"
                :contents-type="contentsType"
                :filter-service="filterService"
                :total-search-episodes-result="part_of_playlist.episodes.count"
                @add-episode="addEpisode"
                @select-episode="selectEpisode"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <div
            v-show="canLoadMoreEpisodes"
            colspan="8"
            align="center"
            class="load-more pt-3 pb-3"
            @click="searchAdditionalResults"
          >
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="amber"
              class="mr-4"
            />
            {{ nextPageStartIndex }}-{{ nextPageEndIndex }}件目を読み込む/全{{
              totalSearchResult
            }}件
          </div>
        </v-expansion-panels>
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
import EpisodeSearchResultTable from '~/components/playlists/EpisodeSearchResultTable.vue'
import EpisodeSearchResultTableRow from '~/components/playlists/EpisodeSearchResultTableRow.vue'

interface DataType {
  episodes: Array<object>
  series: Array<object>
  playlists: Array<object>
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
  modeOfItem: string
  typeOfList: string
  hasIncludeAvailableVideo: boolean
  sortItemNum: number
}

export default Vue.extend({
  name: 'PlaylistEpisodeSearch',
  components: {
    EpisodeSearchResultTable,
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
      series: [],
      playlists: [],
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
      modeOfItem: '',
      typeOfList: '',
      hasIncludeAvailableVideo: false,
      sortItemNum: 0,
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
    sortItem(): string {
      switch (this.sortItemNum) {
        case 0:
          return '並び順'
        case 1:
          return '関連スコア順'
        case 2:
          return '新しい順'
        case 3:
          return '古い順'
        default:
          return '並び順'
      }
    },
    sortTypeQuery(): string {
      const splitSortType = this.sortType.split('_')
      return `order_by=${splitSortType[0]}&order=${splitSortType[1]}`
    },
    queryKey(): string {
      switch (this.queryKeyNum) {
        case 0:
          return 'word'
        case 1:
          return 'concern'
        case 2:
          return 'keyword'
        default:
          return 'word'
      }
    },
    contentsType(): string {
      switch (this.contentsTypeNum) {
        case 0:
          return 'tvepisode'
        case 1:
          return 'tvseries'
        case 2:
          return 'nplaylist'
        default:
          return 'tvepisode'
      }
    },
    displayContentsName(): string {
      switch (this.contentsTypeNum) {
        case 0:
          return 'エピソード'
        case 1:
          return 'シリーズ'
        case 2:
          return 'プレイリスト'
        default:
          return 'エピソード'
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
        this.searchWithKeyword()
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
        this.searchWithKeyword()
      },
    },
    ignoreRange: {
      handler() {
        this.searchWithKeyword()
      },
    },
  },
  methods: {
    searchEpisodes({
      clearCurrentResults,
      isSwitchTab,
      queryKeyNum,
      sortTypeNum,
    }: {
      clearCurrentResults: boolean
      isSwitchTab: boolean
      queryKeyNum: number
      sortTypeNum: number
    }) {
      this.loading = true
      this.contentsTypeNum = 0
      this.series = []
      this.playlists = []
      this.queryKeyNum = queryKeyNum
      this.sortTypeNum = sortTypeNum

      if (isSwitchTab) {
        this.sortTypeNum = 0
      }

      if (clearCurrentResults) {
        this.episodes = []
        this.searchOffset = 0
      }

      let searchUrl = `/episodes/search?${this.queryKey}=${this.editingKeywords}&offset=${this.searchOffset}&${this.sortTypeQuery}&ignore_range=${this.ignoreRange}&size=${this.pageSize}&contents_type=${this.contentsType}`
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
    searchSeries({
      clearCurrentResults,
      isSwitchTab,
      queryKeyNum,
    }: {
      clearCurrentResults: boolean
      isSwitchTab: boolean
      queryKeyNum: number
    }) {
      this.loading = true
      this.contentsTypeNum = 1
      this.episodes = []
      this.playlists = []
      this.queryKeyNum = queryKeyNum

      if (isSwitchTab) {
        this.sortTypeNum = 1
      }

      if (clearCurrentResults) {
        this.series = []
        this.searchOffset = 0
      }

      let searchUrl = `/episodes/search?${this.queryKey}=${this.editingKeywords}&offset=${this.searchOffset}&${this.sortTypeQuery}&ignore_range=${this.ignoreRange}&size=${this.pageSize}&contents_type=${this.contentsType}`
      if (this.filterService) {
        // FIXME: e2 を加えると BadRequest になるため、一旦除外
        searchUrl = searchUrl + '&vService=g1,g2,e1,e3'
      }
      this.$axios
        .get(searchUrl)
        .then((res) => {
          this.series = this.series.concat(res.data.items)
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
    searchPlaylists(
      this: any,
      clearCurrentResults = true,
      isSwitchTab = true,
      queryKeyNum = this.queryKeyNum
    ) {
      this.loading = true
      this.contentsTypeNum = 2
      this.episodes = []
      this.series = []
      this.typeOfList = 'recommend'
      this.modeOfItem = 'tv'
      this.queryKeyNum = queryKeyNum

      if (isSwitchTab) {
        this.sortTypeNum = 1
      }

      if (clearCurrentResults) {
        this.playlists = []
        this.searchOffset = 0
      }

      let searchUrl = `/episodes/search?${this.queryKey}=${this.editingKeywords}&offset=${this.searchOffset}&${this.sortTypeQuery}&size=${this.pageSize}&contents_type=${this.contentsType}&mode_of_item=${this.modeOfItem}&type_of_list=${this.typeOfList}`
      if (this.filterService) {
        // FIXME: e2 を加えると BadRequest になるため、一旦除外
        searchUrl = searchUrl + '&vService=g1,g2,e1,e3'
      }
      this.$axios
        .get(searchUrl)
        .then((res: any) => {
          this.playlists = this.playlists.concat(res.data.items)
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
    searchWithKeyword(
      this: any,
      clearCurrentResults = true,
      isSwitchTab = false,
      queryKeyNum = this.queryKeyNum,
      sortTypeNum = this.sortTypeNum,
      sortItemNum = 0
    ) {
      switch (this.contentsTypeNum) {
        case 0:
          this.searchEpisodes({
            clearCurrentResults,
            isSwitchTab,
            queryKeyNum,
            sortTypeNum,
            sortItemNum,
          })
          break
        case 1:
          this.searchSeries({
            clearCurrentResults,
            isSwitchTab,
            queryKeyNum,
          })
          break
        case 2:
          this.searchPlaylists(clearCurrentResults, isSwitchTab, queryKeyNum)
          break
        default:
          this.searchEpisodes({
            clearCurrentResults,
            isSwitchTab,
            queryKeyNum,
            sortTypeNum,
          })
          break
      }
    },
    addEpisode(episode: any) {
      this.episodes.splice(this.episodes.indexOf(episode), 1)
      this.$emit('add-episode', episode)
    },
    clearSearchPane() {
      this.menu = false
      this.editingKeywords = ''
      this.episodes = []
    },
    searchAdditionalResults() {
      switch (this.contentsTypeNum) {
        case 0:
          this.searchEpisodes({
            clearCurrentResults: false,
            isSwitchTab: false,
            queryKeyNum: this.queryKeyNum,
            sortTypeNum: this.sortTypeNum,
          })
          break
        case 1:
          this.searchSeries({
            clearCurrentResults: false,
            isSwitchTab: false,
            queryKeyNum: this.queryKeyNum,
          })
          break
        case 2:
          this.searchPlaylists(false, false, this.queryKeyNum)
          break
      }
    },
    selectEpisode(episode: any) {
      this.$emit('select-episode', episode)
    },
    eyecatchUrl(series: any): string {
      if (series.eyecatch !== undefined) {
        return series.eyecatch.medium.url
      } else if ((series.keyvisuals || [])[0] !== undefined) {
        return series.keyvisuals[0].small.url
      } else if (series.partOfSeries?.eyecatch !== undefined) {
        return series.partOfSeries.eyecatch.medium.url
      }

      return 'https://placehold.jp/71x40.png'
    },
    logoUrl(series: any): string {
      if (series.logo !== undefined) {
        return series.logo.medium.url
      } else if ((series.keyvisuals || [])[0] !== undefined) {
        return series.keyvisuals[0].small.url
      } else if (series.partOfSeries?.eyecatch !== undefined) {
        return series.partOfSeries.logo.medium.url
      }

      return 'https://placehold.jp/40x40.png'
    },
    isIncludeAvailableVideo(seriesOrPlaylist: any): boolean {
      let isAvailable = false

      if (seriesOrPlaylist.availableEpisodes.count >= 1) {
        isAvailable = true
      }
      return isAvailable
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

.search-result-table {
  max-height: 570px;
  overflow: auto;
}

td.series-image,
td.playlist-image {
  width: 1%;
}

td.series-name,
td.playlist-name {
  width: 35%;
}

td.series-can-be-watch {
  width: 30%;
}

.display-episode {
  text-align: right;
  color: #3498db;
}

.theme--light.v-expansion-panels
  .v-expansion-panel-header
  .v-expansion-panel-header__icon
  .v-icon {
  color: #3498db;
}

.v-btn:before {
  background-color: transparent;
}

.v-input.custom_toggle_filter.v-input--selection-controls.v-input--switch
  label.v-label {
  font-size: 12px;
  white-space: nowrap;
}

.v-expansion-panel-header {
  height: 58px;
}
</style>
