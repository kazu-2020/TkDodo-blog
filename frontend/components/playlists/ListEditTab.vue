<template>
  <div class="list-item-container container-fluid white rounded px-5 py-2">
    <v-row @click="closePreviewDrawer">
      <v-col cols="12">
        <playlist-episodes-list
          :episodes="playlistItems"
          @delete-episode="deleteEpisode"
          @update-episodes="updateEpisodes"
          @select-episode="selectEpisode"
        />
      </v-col>
    </v-row>
    <v-row v-show="diffEpisodeItems.length !== 0" class="article_epidoes">
      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header
              ><div>
                プレイリストに保存されていない記事エピソードが
                <span class="diff_episodes_count"
                  >{{ diffEpisodeItems.length }}件</span
                >あります
              </div></v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <v-simple-table>
                <template #default>
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
                      v-for="episode in diffEpisodeItems"
                      :key="episode.id"
                      :episode="episode"
                      :ignore-episodes="playlistItems"
                      @add-episode="addEpisode"
                      @select-episode="selectEpisode"
                    />
                  </tbody>
                </template>
              </v-simple-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <playlist-episode-search
          :ignore-episodes="playlistItems"
          :keywords.sync="keywords"
          :search-trigger-count="searchTriggerCount"
          @add-episode="addEpisode"
          @select-episode="selectEpisode"
        />
      </v-col>
    </v-row>
    <episode-preview-drawer
      :episode="selectedEpisode"
      :visible="previewDrawer"
      @close-drawer="closePreviewDrawer"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { EpisodeData } from '@/types/episode_data'
import PlaylistEpisodesList from '~/components/playlists/PlaylistEpisodesList.vue'
import PlaylistEpisodeSearch from '~/components/playlists/PlaylistEpisodeSearch.vue'
import EpisodePreviewDrawer from '~/components/playlists/EpisodePreviewDrawer.vue'
import EpisodeSearchResultTableRow from '~/components/playlists/EpisodeSearchResultTableRow.vue'

interface DataType {
  keywords: string
  searchTriggerCount: number
  selectedEpisode: EpisodeData | undefined
  previewDrawer: boolean
}

export default Vue.extend({
  name: 'ListEditTab',
  components: {
    PlaylistEpisodesList,
    PlaylistEpisodeSearch,
    EpisodePreviewDrawer,
    EpisodeSearchResultTableRow,
  },
  props: {
    playlist: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      keywords: '',
      searchTriggerCount: 0,
      selectedEpisode: undefined,
      previewDrawer: false,
    }
  },
  computed: {
    playlistItems(): Array<Object> {
      return this.playlist.items || []
    },
    articleEpisodes(): Array<Object> {
      return this.playlist.article?.containsEpisodes || []
    },
    diffEpisodeItems(): Array<Object> {
      const playlistItems = (this as any).playlistItems
      const articleItems = (this as any).articleEpisodes

      const diffItems = articleItems.filter(
        (v: any) => !playlistItems.map((x: any) => x.id).includes(v.id)
      )

      return diffItems
    },
  },
  methods: {
    addEpisode(episode: any) {
      this.$emit('add-episode', episode)
    },
    deleteEpisode(episode: any) {
      this.$emit('delete-episode', episode)
    },
    eyecatchUrl(item: any): string {
      if (item.eyecatch !== undefined) {
        return item.eyecatch.medium.url
      } else {
        return ''
      }
    },
    updateEpisodes(episodes: any) {
      this.$emit('update-episodes', episodes)
    },
    selectEpisode(episode: any) {
      this.selectedEpisode = episode
      this.previewDrawer = true
    },
    closePreviewDrawer() {
      this.selectedEpisode = undefined
      this.previewDrawer = false
    },
  },
})
</script>

<style lang="scss" scoped>
span.diff_episodes_count {
  font-weight: bold;
}
</style>
