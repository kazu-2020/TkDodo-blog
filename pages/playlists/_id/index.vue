<template>
  <v-layout column>
    <v-row>
      <v-col cols="12">
        <v-card color="#F5F5F5">
          <v-container>
            <v-row justify="space-between">
              <v-col cols="auto">
                <v-img
                  :src="logoImageUrl(playlist)"
                  width="140"
                  style="border-radius: 4px; overflow: hidden"
                  class="pt-1"
                />
              </v-col>
              <v-col class="mr-auto">
                <v-card-title class="headline pt-0">
                  {{ playlist.name }}
                  <v-card-subtitle
                    v-if="playlist.detailedNameRuby"
                    class="detailed-name-ruby"
                  >
                    ( {{ playlist.detailedNameRuby }} )
                  </v-card-subtitle>
                  <div class="chips">
                    <v-chip class="ma-2" small> 非公開 </v-chip>
                    <v-chip
                      class="ma-2"
                      color="primary"
                      small
                      @click="copyPlaylistId"
                    >
                      ID: {{ playlist.id }}
                    </v-chip>
                    <v-chip
                      v-if="playlist.originalSeriesId"
                      class="ma-2"
                      color="secondary"
                      small
                      @click="copySeriesId"
                    >
                      SeriesID: {{ playlist.originalSeriesId }}
                    </v-chip>
                  </div>
                </v-card-title>
                <v-card-subtitle v-if="playlist.detailedCatch">
                  ~ {{ playlist.detailedCatch }} ~
                </v-card-subtitle>
                <v-card-text v-text="playlist.description" />
              </v-col>
              <v-col
                v-if="hasActorsOrContributors"
                cols="auto"
                style="width: 230px"
                class="hidden-sm-and-down"
              >
                <v-tooltip
                  v-for="(data, index) in actorsAndContributors"
                  :key="`actor-contributor-${index}`"
                  bottom
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      v-if="noActorContributorImage(data)"
                      class="actor_contributor_badge"
                      v-bind="attrs"
                      v-on="on"
                      @click="fillSearchBox(data)"
                    >
                      <div class="actor_contributor_badge_inner">
                        {{ actorContributorName(data).slice(0, 1) }}
                      </div>
                    </div>
                    <v-img
                      v-else
                      :src="actorContributorImageUrl(data)"
                      width="40"
                      v-bind="attrs"
                      class="actor_contributor_badge"
                      v-on="on"
                      @click="fillSearchBox(data)"
                    />
                  </template>
                  <span>{{ actorContributorName(data) }}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="auto" class="text-center">
                <v-row class="flex-column ma-0 fill-height">
                  <v-col class="px-0 pt-0">
                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="#000000"
                          icon
                          v-bind="attrs"
                          :to="`/playlists/${playlist.id}/edit`"
                          nuxt
                          small
                          v-on="on"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span>メタを編集する</span>
                    </v-tooltip>
                  </v-col>
                  <v-col class="px-0 pt-0">
                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="#000000"
                          icon
                          v-bind="attrs"
                          :to="`/playlists/${playlist.id}/article`"
                          nuxt
                          small
                          v-on="on"
                        >
                          <v-icon>mdi-note-text-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>記事を編集する</span>
                    </v-tooltip>
                  </v-col>
                  <v-col class="px-0 pt-0">
                    <playlist-json-dialog
                      button-color="#000000"
                      :playlist-id="playlist.id"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </v-col>
                  <v-col />
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h3>エピソード選定</h3>
      </v-col>
      <v-col cols="12">
        <playlist-episodes-list
          :episodes="playlistItems"
          @update-episodes="updateEpisodes"
          @delete-episode="deleteEpisode"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" align="center">
        <v-btn color="orange" @click="saveEpisodes">
          上記の内容で保存する
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-divider />
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
    <playlist-episode-search
      :ignore-episodes="playlistItems"
      :keywords.sync="keywords"
      :search-trigger-count="searchTriggerCount"
      @add-episode="addEpisode"
    />
    <v-snackbar v-model="snackbar" timeout="2000">
      コピーしました
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { Playlist } from '@/types/playlist'
import PlaylistEpisodesList from '~/components/playlists/PlaylistEpisodesList.vue'
import PlaylistEpisodeSearch from '~/components/playlists/PlaylistEpisodeSearch.vue'
import EpisodeSearchResultTableRow from '~/components/playlists/EpisodeSearchResultTableRow.vue'
import PlaylistJsonDialog from '~/components/playlists/PlaylistJsonDialog.vue'
import unloadAlertMixin from '~/components/common/unloadAlertMixin.ts'

interface DataType {
  snackbar: boolean
  url: String
  jsonDialog: boolean
  keywords: String
  searchTriggerCount: number
}

export default Vue.extend({
  name: 'PlaylistIdIndexComponent',
  components: {
    EpisodeSearchResultTableRow,
    PlaylistEpisodesList,
    PlaylistEpisodeSearch,
    PlaylistJsonDialog,
  },
  mixins: [unloadAlertMixin],
  async asyncData({ store, params }) {
    await store.dispatch('playlists/fetchPlaylist', params.id)
  },
  data(): DataType {
    return {
      snackbar: false,
      url:
        'https://pbs.twimg.com/profile_images/1111451081135943680/d1sPJsQf_400x400.png',
      jsonDialog: false,
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
    actorsAndContributors(): Array<Object> {
      const actors = this.playlist.actor || []
      const contributors = this.playlist.contributor || []

      return actors.concat(contributors).slice(0, 12)
    },
    hasActorsOrContributors(): boolean {
      return this.actorsAndContributors.length !== 0
    },
  },
  methods: {
    logoImageUrl(playlist: any) {
      return playlist.logo?.medium?.url || this.dummyImage(playlist.dateCreated)
    },
    saveEpisodes() {
      ;(this as any).notShowUnloadAlert()
      this.$store.dispatch('loading/startLoading', {
        success: '正常に保存できました',
        error: '保存できませんでした',
      })
      this.$store.dispatch('playlists/saveEditingPlaylistEpisodes')
    },
    copyPlaylistId(): void {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.playlist.id)
        this.snackbar = true
      }
    },
    copySeriesId() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.playlist.originalSeriesId)
        this.snackbar = true
      }
    },
    dummyImage(time: any) {
      const logoNumber = (Number(moment(time).format('DD')) % 10) + 1
      return `/dummy/default${logoNumber}/default${logoNumber}-logo.png`
    },
    updateEpisodes(episodes: any) {
      this.$store.dispatch('playlists/updateEditingPlaylistEpisodes', episodes)
    },
    addEpisode(episode: any) {
      ;(this as any).showUnloadAlert()
      this.$store.dispatch('playlists/addEditingPlaylistEpisode', episode)
    },
    deleteEpisode(episode: any) {
      ;(this as any).showUnloadAlert()
      this.$store.dispatch('playlists/deleteEditingPlaylistEpisode', episode)
    },
    actorContributorName(data: any): string {
      return data.person?.name || data.organization?.name || ''
    },
    actorContributorImageUrl(data: any): string {
      return (
        data.person?.image?.small?.url ||
        data.organization?.image?.small?.url ||
        ''
      )
    },
    noActorContributorImage(data: any): boolean {
      return this.actorContributorImageUrl(data) === ''
    },
    fillSearchBox(data: any): void {
      this.keywords = this.actorContributorName(data)
      this.searchTriggerCount++
    },
  },
})
</script>

<style lang="scss" scoped>
.v-card__subtitle.detailed-name-ruby {
  padding: 8px;
}

.v-input.episode-search.v-text-field.v-text-field--single-line.v-text-field--solo.v-text-field--is-booted.v-text-field--enclosed {
  .v-text-field__details {
    display: none;
  }
}

span.diff_episodes_count {
  font-weight: bold;
}

.actor_contributor_badge {
  border-radius: 20px;
  overflow: hidden;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 16px;
  cursor: pointer;
  background-color: #546e7a;
  width: 40px;
  height: 40px;
  position: relative;

  .actor_contributor_badge_inner {
    display: inline-block;
    position: relative;
    top: 6px;
    left: 12px;
    color: white;
    font-weight: bold;
  }
}
</style>

<style lang="scss">
.article_epidoes .v-expansion-panel-content__wrap {
  padding: 0 0 16px;
}
</style>
