<template>
  <v-simple-table fixed-header class="episode-search-result-table">
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
        v-for="episode in searchResult.episodes.result"
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
          @click="searchAdditionalEpisodes(searchResult.id)"
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
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from 'vue'
import EpisodeSearchResultTableRow from '~/components/playlists/EpisodeSearchResultTableRow.vue'

interface DataType {
  loading: boolean
  totalSearchResult: number
  searchOffset: number
}

export default Vue.extend({
  name: 'EpisodeSearchResultTable',
  components: { EpisodeSearchResultTableRow },
  props: {
    searchResult: {
      type: Object,
      required: true,
    },
    ignoreEpisodes: {
      type: Array,
      required: false,
      default: () => [],
    },
    editingKeywords: {
      type: String,
      required: false,
    },
    sortTypeQuery: {
      type: String,
      required: false,
    },
    ignoreRange: {
      type: Boolean,
      required: false,
    },
    contentsType: {
      type: String,
      required: false,
    },
    filterService: {
      type: Boolean,
      required: false,
    },
    queryKey: {
      type: String,
      required: false,
    },
    totalSearchEpisodesResult: {
      type: Number,
      required: true,
    },
  },
  data(): DataType {
    return {
      loading: false,
      totalSearchResult: this.$props.totalSearchEpisodesResult,
      searchOffset: 10,
    }
  },
  computed: {
    pageSize(): number {
      return 10
    },
    nextPageStartIndex(): number {
      return this.searchOffset + 1
    },
    nextPageEndIndex(): number {
      return Math.min(this.searchOffset + this.pageSize, this.totalSearchResult)
    },
    canLoadMoreEpisodes(): boolean {
      return this.searchOffset < this.totalSearchResult
    },
  },
  methods: {
    searchEpisodes(searchResultId: number) {
      this.loading = true
      let searchUrl = ''

      searchUrl = `/episodes/search?${this.$props.queryKey}=${this.$props.editingKeywords}&offset=${this.searchOffset}&${this.$props.sortTypeQuery}&ignore_range=${this.$props.ignoreRange}&size=${this.pageSize}&contents_type=${this.contentsType}&series_id=${searchResultId}`
      if (this.$props.filterService) {
        // FIXME: e2 を加えると BadRequest になるため、一旦除外
        searchUrl = searchUrl + '&service=g1,g2,e1,e3'
      }
      this.$axios
        .get(searchUrl)
        .then((res) => {
          this.$props.searchResult.episodes.result =
            this.searchResult.episodes.result.concat(res.data.items)
          this.totalSearchResult = res.data.total
          this.searchOffset += this.pageSize
        })
        .finally(() => {
          this.loading = false
          if (this.searchResult.episodes.result.length <= this.pageSize) {
            this.$scrollTo('#episode-search-result', 1400, {
              easing: [0, 0, 0.1, 1],
              offset: -195,
            })
          }
        })
    },
    addEpisode(episode: any): void {
      this.$emit('add-episode', episode)
    },
    selectEpisode(episode: any) {
      this.$emit('select-episode', episode)
    },
    searchAdditionalEpisodes(searchResultId: number) {
      this.searchEpisodes(searchResultId)
    },
  },
})
</script>

<style lang="scss">
.result_row {
  .add_button.v-btn.v-btn--tile.v-size--small {
    min-width: 0;
    padding: 0 2px;
  }
}

.episode-search-result-table > .v-data-table__wrapper {
  max-height: 300px;
}
</style>
