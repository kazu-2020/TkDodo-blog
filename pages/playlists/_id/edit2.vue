<template>
  <v-layout column style="position: relative">
    <v-row style="position: relative" class="mt-4">
      <v-col cols="auto">
        <playlist-stepper :current="currentTab" @change-tab="changeTab" />
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="orange"
          class="save-button"
          elevation="0"
          style="position: absolute; right: 0"
          >保存する</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9" class="list-item-container mt-4">
        <h2>リスト</h2>
        <v-row>
          <v-col cols="12">
            <playlist-episodes-list
              :episodes="playlistItems"
              @delete-episode="deleteEpisode"
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
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="preview-container">
        <div class="preview-container-inner mt-1 pa-2">
          <basic-information-view :playlist="playlist" />
          <v-col cols="12">
            <v-list dense>
              <v-list-item
                v-for="item in playlistItems"
                :key="item.id"
                class="px-0"
              >
                <v-list-item-icon class="mr-1">
                  <v-img
                    :src="eyecatchUrl(item)"
                    lazy-src="https://placehold.jp/50x28.png"
                    width="50"
                    class="episode-image"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-divider />
          article
        </div>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Playlist } from '@/types/playlist'
import PlaylistEpisodesList from '~/components/playlists/PlaylistEpisodesList.vue'
import PlaylistEpisodeSearch from '~/components/playlists/PlaylistEpisodeSearch.vue'
import PlaylistStepper from '~/components/playlists/PlaylistStepper.vue'
import BasicInformationView from '~/components/playlists/BasicInformationView.vue'
import { PlaylistTab } from '~/models/definitions'

interface DataType {
  keywords: string
  searchTriggerCount: number
  currentTab: PlaylistTab
}

export default Vue.extend({
  name: 'PlaylistIdEdit2Page',
  components: {
    BasicInformationView,
    PlaylistEpisodesList,
    PlaylistEpisodeSearch,
    PlaylistStepper,
  },
  async asyncData({ store, params }) {
    await store.dispatch('playlists/fetchPlaylist', params.id)
  },
  data(): DataType {
    return {
      keywords: '',
      searchTriggerCount: 0,
      currentTab: PlaylistTab.list,
    }
  },
  computed: {
    playlist(): Playlist {
      return this.$store.state.playlists.editingPlaylist
    },
    playlistItems(): Array<Object> {
      return this.$store.state.playlists.editingPlaylist.items
    },
  },
  methods: {
    addEpisode(episode: any) {
      this.$store.dispatch('playlists/addEditingPlaylistEpisode', episode)
    },
    deleteEpisode(episode: any) {
      this.$store.dispatch('playlists/deleteEditingPlaylistEpisode', episode)
    },
    articleEpisodes(): Array<Object> {
      return this.$store.state.playlists.editingPlaylist.article
        .containsEpisodes
    },
    diffEpisodeItems(): Array<Object> {
      const playlistItems = (this as any).playlistItems
      const articleItems = (this as any).articleEpisodes

      const diffItems = articleItems.filter(
        (v: any) => !playlistItems.map((x: any) => x.id).includes(v.id)
      )

      return diffItems
    },
    eyecatchUrl(item: any): string {
      if (item.eyecatch !== undefined) {
        return item.eyecatch.medium.url
      } else {
        return ''
      }
    },
    changeTab(nextTab: PlaylistTab) {
      this.currentTab = nextTab
    },
  },
})
</script>

<style lang="scss" scoped>
.save-button {
  color: white;
  width: 140px;
}

.list-item-container {
  background-color: white;
  border-radius: 6px;
}

.preview-container-inner {
  background-color: white;
  border-radius: 6px;
}
</style>
