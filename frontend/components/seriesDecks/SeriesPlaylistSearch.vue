<template>
  <div class="episode-search-area">
    <v-row justify="end">
      <v-col cols="12" class="mt-8">
        <v-text-field
          v-model="editingKeywords"
          label="シリーズを検索する"
          prepend-inner-icon="mdi-magnify"
          solo
          class="episode-search"
          hide-details
          :loading="loading"
          clearable
          @keypress.enter="searchSeriesWithKeyword"
        />
        <v-tabs v-model="tab" class="pt-1">
          <v-tab v-for="tabItem in tabItems" :key="tabItem">
            {{ tabItem }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-row id="series-playlist-search-result">
      <v-col v-if="playlists.length !== 0" cols="12">
        <div class="body-2 ml-1">全 {{ totalSearchResult }} 件</div>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th style="width: 10%" />
                <th style="width: 10%" />
                <th class="text-left">シリーズ名</th>
              </tr>
            </thead>
            <tbody>
              <series-playlist-search-result-table-row
                v-for="playlist in playlists"
                :key="`search-result-${playlist.seriesId}`"
                :playlist="playlist"
                :ignore-playlists="ignorePlaylists"
                @add-playlist="addPlaylist"
                @select-playlist="selectPlaylist(playlist)"
              />
              <tr v-show="canLoadMorePlaylists">
                <td
                  colspan="8"
                  align="center"
                  class="load-more"
                  @click="searchAdditionalPlaylists"
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
      </v-col>
      <v-col v-else-if="isNoResult" cols="12">
        <v-alert text outlined color="deep-orange" icon="mdi-alert-outline">
          プレイリストは見つかりませんでした。 <br />
          他のキーワードや条件でお探しください
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SeriesPlaylistSearchResultTableRow from '~/components/seriesDecks/SeriesPlaylistSearchResultTableRow.vue'

interface DataType {
  playlists: Array<object>
  loading: boolean
  isNoResult: boolean
  searchOffset: number
  totalSearchResult: number
  tab: number
  tabItems: string[]
}

export default Vue.extend({
  name: 'SeriesPlaylistSearch',
  components: {
    SeriesPlaylistSearchResultTableRow,
  },
  props: {
    ignorePlaylists: {
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
      playlists: [],
      loading: false,
      isNoResult: false,
      searchOffset: 0,
      totalSearchResult: 0,
      tab: 0,
      tabItems: ['ワード', 'キーワード', '出演者名'],
    }
  },
  computed: {
    canLoadMorePlaylists(): boolean {
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
    queryKey(): string {
      switch (this.tab) {
        case 0:
          return 'word'
        case 1:
          return 'keyword'
        case 2:
          return 'concern'
        default:
          return 'word'
      }
    },
  },
  watch: {
    searchTriggerCount: {
      handler(newVal: Number) {
        if (newVal === 0) return
        this.searchSeriesWithKeyword()
      },
      immediate: true,
    },
    editingKeywords: {
      handler(newVal: string | null) {
        if (newVal == null) {
          this.playlists = []
        }
      },
    },
    tab: {
      handler() {
        this.searchSeriesWithKeyword()
      },
    },
  },
  methods: {
    searchSeriesPlaylists({
      clearCurrentSeriesPlaylists,
    }: {
      clearCurrentSeriesPlaylists: boolean
    }) {
      this.loading = true

      if (clearCurrentSeriesPlaylists) {
        this.playlists = []
        this.searchOffset = 0
      }

      const searchUrl = `/series_playlists/search?${this.queryKey}=${this.editingKeywords}&offset=${this.searchOffset}&size=${this.pageSize}`
      this.$axios
        .get(searchUrl)
        .then((res) => {
          this.playlists = this.playlists.concat(res.data.result)
          this.totalSearchResult = res.data.count
          this.isNoResult = this.totalSearchResult === 0
          this.searchOffset += this.pageSize
        })
        .finally(() => {
          this.loading = false
          if (this.playlists.length <= this.pageSize) {
            this.$scrollTo('#series-playlist-search-result', 1400, {
              easing: [0, 0, 0.1, 1],
              offset: -195,
            })
          }
        })
    },
    searchSeriesWithKeyword() {
      this.searchSeriesPlaylists({ clearCurrentSeriesPlaylists: true })
    },
    addPlaylist(playlist: any) {
      this.playlists.splice(this.playlists.indexOf(playlist), 1)
      this.$emit('add-playlist', playlist)
    },
    searchAdditionalPlaylists() {
      this.searchSeriesPlaylists({ clearCurrentSeriesPlaylists: false })
    },
    selectPlaylist(playlist: any) {
      this.$emit('select-playlist', playlist)
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
</style>
