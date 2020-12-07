<template>
  <div>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Playlist } from '@/types/playlist'
import PlaylistEpisodesList from '~/components/playlists/PlaylistEpisodesList.vue'
import PlaylistEpisodeSearch from '~/components/playlists/PlaylistEpisodeSearch.vue'

interface DataType {
  keywords: string
  searchTriggerCount: number
}

export default Vue.extend({
  name: 'ListEditTab',
  components: {
    PlaylistEpisodesList,
    PlaylistEpisodeSearch,
  },
  data(): DataType {
    return {
      keywords: '',
      searchTriggerCount: 0,
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
      this.$emit('update-episodes-list')
      this.$store.dispatch('playlists/addEditingPlaylistEpisode', episode)
    },
    deleteEpisode(episode: any) {
      this.$emit('update-episodes-list')
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
  },
})
</script>

<style lang="scss" scoped></style>
