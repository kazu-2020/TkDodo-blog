<template>
  <v-simple-table fixed-header>
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
      <series-episode-search-result-table-row
        v-for="episode in series.episodes.result"
        :key="episode.id"
        :episode="episode"
        :ignore-episodes="ignoreEpisodes"
        @add-episode="addEpisode"
        @select-episode="selectEpisode(episode)"
      />

      <tr v-show="true">
        <td
          colspan="8"
          align="center"
          class="load-more"
          @click="searchAdditionalEpisodes(series.id)"
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
import SeriesEpisodeSearchResultTableRow from '~/components/playlists/SeriesEpisodeSearchResultTableRow.vue'

interface DataType {
  loading: boolean
  totalSearchResult: number
}

export default Vue.extend({
  name: 'SeriesEpisodeSearchResultTable',
  components: {
    SeriesEpisodeSearchResultTableRow,
  },
  props: {
    series: {
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
    searchOffset: {
      type: Number,
      required: false,
    },
    sortType: {
      type: String,
      required: false,
    },
    ignoreRange: {
      type: Boolean,
      required: false,
    },
    pageSize: {
      type: Number,
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
    }
  },
  computed: {
    nextPageStartIndex(): number {
      return this.$props.searchOffset + 1
    },
    nextPageEndIndex(): number {
      return Math.min(
        this.$props.searchOffset + this.$props.pageSize,
        this.totalSearchResult
      )
    },
  },
  methods: {
    searchEpisodes(seriesId: number) {
      this.loading = true

      let searchUrl = `/episodes/search?${this.$props.queryKey}=${this.$props.editingKeywords}&offset=${this.$props.searchOffset}&${this.$props.sortTypeQuery}&ignore_range=${this.$props.ignoreRange}&size=${this.pageSize}&contents_type=${this.contentsType}&series_id=${seriesId}`
      if (this.$props.filterService) {
        // FIXME: e2 を加えると BadRequest になるため、一旦除外
        searchUrl = searchUrl + '&service=g1,g2,e1,e3'
      }
      this.$axios
        .get(searchUrl)
        .then((res) => {
          this.$props.series.episodes.result =
            this.series.episodes.result.concat(res.data.items)
          this.totalSearchResult = res.data.total
          this.$props.searchOffset += this.pageSize
        })
        .finally(() => {
          this.loading = false
          if (this.series.episodes.result.length <= this.pageSize) {
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
    searchAdditionalEpisodes(seriesId: number) {
      this.searchEpisodes(seriesId)
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
</style>
