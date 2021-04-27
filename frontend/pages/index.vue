<template>
  <v-layout column>
    <v-row justify="center">
      <v-col cols="11">
        <v-row justify="space-between">
          <v-col cols="6">
            <div class="title mb-4 pt-2">プレイリスト一覧</div>
            <v-text-field
              v-model="searchKeyword"
              label="プレイリストタイトルで検索"
              prepend-inner-icon="mdi-magnify"
              solo
              class="playlist-search"
              hide-details
              clearable
              @keypress.enter="searchPlaylistWithKeyword"
            />
          </v-col>
          <v-col cols="4" style="display: table">
            <div class="mode_switch_block">
              <v-switch
                v-model="articleMode"
                label="記事モード"
                class="mode_switch pt-14"
                style="display: table-cell; width: 130px"
              />
            </div>
            <v-select
              v-model="selectedPublishedStateFilter"
              :items="publishedStateFilters"
              item-text="text"
              item-value="state"
              class="pt-16 pl-4"
              style="max-width: 100px; display: table-cell"
              dense
              solo
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="totalPages > 1">
      <v-col cols="12">
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="totalPages"
            :total-visible="totalVisiblePagination"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          />
        </div>
      </v-col>
    </v-row>
    <v-row v-if="articleMode" justify="center">
      <v-col v-for="item in playlists" :key="item.id" cols="11" class="py-1">
        <article-item
          :playlist="item"
          @click-playlist-item="clickPlaylistItem"
        />
      </v-col>
    </v-row>
    <v-row v-else justify="center">
      <v-col v-for="item in playlists" :key="item.id" cols="11" class="py-1">
        <simple-playlist-item
          :playlist="item"
          @click-playlist-item="clickPlaylistItem"
        />
      </v-col>
    </v-row>
    <v-row v-if="totalPages > 1">
      <v-col cols="12">
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="totalPages"
            :total-visible="totalVisiblePagination"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          />
        </div>
      </v-col>
    </v-row>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      right
      hide-overlay
      :width="drawerWidth"
      style="position: fixed"
    >
      <v-list-item class="pa-2">
        <v-col cols="12">
          <playlist-index-basic-information-view :playlist="selectedPlaylist" />
        </v-col>
      </v-list-item>
      <v-list-item class="mb-4">
        <v-row v-show="!articleMode" justify="center">
          <v-col cols="4">
            <v-btn
              :to="{
                name: 'playlists-id',
                params: { id: selectedPlaylistId },
              }"
              nuxt
              depressed
              color="orange"
              class="edit_button"
            >
              <v-icon left>mdi-pencil</v-icon>
              編集する
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn
              class="delete_button"
              outlined
              @click="deleteSelectedPlaylist"
            >
              <v-icon left>mdi-delete</v-icon>
              削除する
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  :href="playlistWebPreviewUrl(selectedPlaylist)"
                  small
                  fab
                  outlined
                  class="mr-2"
                  target="_blank"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-file-document-outline</v-icon>
                </v-btn>
              </template>
              <span>ペライチ プレビュー</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  :href="playlistSitePreviewUrl(selectedPlaylist)"
                  small
                  fab
                  outlined
                  target="_blank"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-sitemap</v-icon>
                </v-btn>
              </template>
              <span>サイト プレビュー</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row v-show="articleMode" justify="center">
          <v-col cols="4">
            <v-btn
              :to="{
                name: 'playlists-id',
                params: { id: selectedPlaylistId },
                hash: '#article',
              }"
              nuxt
              depressed
              color="orange"
              class="edit_button"
            >
              <v-icon left>mdi-pencil</v-icon>
              編集する
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn
              class="delete_button"
              outlined
              @click="deleteSelectedPlaylist"
            >
              <v-icon left>mdi-delete</v-icon>
              削除する
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  :href="playlistWebPreviewUrl(selectedPlaylist)"
                  small
                  fab
                  outlined
                  class="mr-2"
                  target="_blank"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-file-document-outline</v-icon>
                </v-btn>
              </template>
              <span>ペライチ プレビュー</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  :href="playlistSitePreviewUrl(selectedPlaylist)"
                  small
                  fab
                  outlined
                  target="_blank"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-sitemap</v-icon>
                </v-btn>
              </template>
              <span>サイト プレビュー</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item
        v-for="item in selectedPlaylistItems"
        :key="item.id"
        class="px-6 episode_list"
      >
        <v-list-item-icon class="mr-3 my-3">
          <div style="position: relative">
            <v-img
              :src="eyecatchUrl(item)"
              lazy-src="https://placehold.jp/71x40.png"
              width="71"
              height="40"
            >
              <div v-if="!hasVideo(item)" class="no_video">視聴不可</div>
            </v-img>
          </div>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title style="font-size: 14px" v-text="item.name" />
          <v-list-item-subtitle
            style="font-size: 12px; margin-top: 4px"
            v-text="seriesName(item)"
          />
        </v-list-item-content>
      </v-list-item>
      <v-divider v-if="selectedActorsAndContributors.length > 0" class="mt-4" />
      <div
        v-if="selectedActorsAndContributors.length > 0"
        class="subtitle-1 px-5 pt-2"
      >
        出演者/スタッフ
      </div>
      <actor-contributor-list
        v-if="selectedActorsAndContributors.length > 0"
        :actors-and-contributors="selectedActorsAndContributors"
        class="mx-2"
      />
      <v-divider class="mt-4" />
      <v-list-item>
        <div class="article_preview">
          <!-- eslint-disable vue/no-v-html -->
          <p
            style="text-align: start"
            class="body-1"
            v-html="selectedPlaylistArticle"
          />
          <!-- eslint-enable -->
        </div>
      </v-list-item>
    </v-navigation-drawer>
    <v-dialog v-model="isShowLoadingDialog" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text class="pt-2">
          読込中...
          <v-progress-linear indeterminate color="white" class="mb-0 mt-2" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import ActorContributorList from '../components/playlists/ActorContributorList.vue'
import SimplePlaylistItem from '~/components/common/SimplePlaylistItem.vue'
import ArticleItem from '~/components/playlists/ArticleItem.vue'
import PlaylistIndexBasicInformationView from '~/components/playlists/PlaylistIndexBasicInformationView.vue'
import { Playlist } from '~/types/playlist'
import { EpisodeData } from '~/types/episode_data'

interface DataType {
  page: number
  totalVisiblePagination: number
  articleMode: boolean
  drawer: boolean
  selectedPlaylist: Playlist | undefined
  selectedPlaylistItems: EpisodeData[]
  selectedPlaylistActorContributor: Object[]
  width: number
  selectedPublishedStateFilter: string
  searchKeyword: string | undefined
  isShowLoadingDialog: boolean
}

export default Vue.extend({
  name: 'PlaylistIndexPage',
  components: {
    SimplePlaylistItem,
    ActorContributorList,
    ArticleItem,
    PlaylistIndexBasicInformationView,
  },
  async asyncData({ store }) {
    await store.dispatch('playlists/fetchPlaylists', {
      page: 1,
      publishedState: 'draft',
    })
  },
  data(): DataType {
    return {
      page: 1,
      totalVisiblePagination: 9,
      articleMode: (this as any).$cookies.get('articleMode') === 'true',
      drawer: false,
      selectedPlaylist: undefined,
      selectedPlaylistItems: [],
      selectedPlaylistActorContributor: [],
      width: window.innerWidth,
      selectedPublishedStateFilter: 'draft',
      searchKeyword: undefined,
      isShowLoadingDialog: false,
    }
  },
  computed: {
    playlists() {
      return this.$store.state.playlists.allItems
    },
    totalPages() {
      return this.$store.state.playlists.pagination.totalPages
    },
    selectedPlaylistArticle(): string {
      const article = this.selectedPlaylist?.article?.plainBody || ''
      return article.replace(/\n\n/g, '<br/>')
    },
    selectedPlaylistId(): string {
      return this.selectedPlaylist ? this.selectedPlaylist.id : ''
    },
    selectedPlaylistBrowsableItemCount(): number {
      return this.selectedPlaylist
        ? this.selectedPlaylist.browsableItemCount
        : 0
    },
    drawerWidth(): number {
      const halfSize = this.width * 0.95
      return Math.min(halfSize, 520)
    },
    selectedActorsAndContributors(): Array<Object> {
      const actors = (this.selectedPlaylistActorContributor as any)?.actor || []
      const contributors =
        (this.selectedPlaylistActorContributor as any)?.contributor || []

      return actors.concat(contributors)
    },
    publishedStateFilters(): Array<Object> {
      return [
        { state: 'draft', text: '下書きのみ' },
        { state: 'secret', text: '非公開のみ' },
        { state: '', text: '全て' },
      ]
    },
  },
  watch: {
    page: {
      handler(newValue) {
        this.isShowLoadingDialog = true
        this.$store.dispatch('playlists/fetchPlaylists', newValue)
      },
    },
    articleMode: {
      handler(newValue) {
        ;(this as any).$cookies.set('articleMode', newValue, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        })
      },
    },
    drawer: {
      handler(newValue) {
        if (!newValue) {
          this.selectedPlaylist = undefined
        }
      },
    },
    selectedPlaylist: {
      handler() {
        this.fetchEpisodes()
        this.fetchActorContributor()
      },
    },
    selectedPublishedStateFilter: {
      handler(newValue) {
        this.isShowLoadingDialog = true
        this.$store.dispatch('playlists/fetchPlaylists', {
          page: 1,
          publishedState: newValue,
          query: this.searchKeyword,
        })
      },
    },
    searchKeyword: {
      handler(newValue) {
        if (newValue === null) {
          this.isShowLoadingDialog = true
          this.$store.dispatch('playlists/fetchPlaylists', {
            page: 1,
            publishedState: this.selectedPublishedStateFilter,
          })
        }
      },
    },
    playlists: {
      handler(_newValue) {
        this.isShowLoadingDialog = false
      },
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize(): void {
      this.width = window.innerWidth
    },
    deleteSelectedPlaylist(): void {
      const message = '削除したデータは復元できません。本当に削除しますか？'
      if (window.confirm(message)) {
        this.$store.dispatch('loading/startLoading', {
          success: '削除しました',
          error: '削除失敗しました',
        })
        this.$store.dispatch('playlists/deletePlaylist', this.selectedPlaylist)
        this.drawer = false
      }
    },
    clickPlaylistItem(playlist: any) {
      this.drawer = true
      this.selectedPlaylistItems = []
      this.selectedPlaylistActorContributor = []
      this.selectedPlaylist = playlist
    },
    eyecatchUrl(item: any): string {
      if (item.eyecatch !== undefined) {
        return item.eyecatch.medium.url
      } else {
        return 'https://placehold.jp/71x40.png'
      }
    },
    fetchEpisodes(): void {
      if (this.selectedPlaylist === undefined) return
      if (this.selectedPlaylistItems.length !== 0) return

      this.$axios
        .get(`/playlists/${this.selectedPlaylist.id}/playlist_items`)
        .then((res) => {
          this.selectedPlaylistItems = res.data.items
        })
    },
    fetchActorContributor(): void {
      if (this.selectedPlaylist === undefined) return
      if (this.selectedPlaylistActorContributor.length !== 0) return

      this.$axios
        .get(`/playlists/${this.selectedPlaylist.id}/actors_and_contributors`)
        .then((res) => {
          this.selectedPlaylistActorContributor = res.data
        })
    },
    searchPlaylistWithKeyword(): void {
      this.isShowLoadingDialog = true
      this.$store.dispatch('playlists/fetchPlaylists', {
        page: 1,
        publishedState: this.selectedPublishedStateFilter,
        query: this.searchKeyword,
      })
    },
    seriesName(item: any): string {
      return item?.partOfSeries?.name || ''
    },
    hasVideo(episode: any) {
      const videos = episode?.videos || []
      const okushibuVideo = videos.find(
        (video: any) => video.identifierGroup?.environmentId === 'okushibu'
      )
      return !!okushibuVideo
    },
    playlistWebPreviewUrl(selectedPlaylist: any): string {
      return `https://psychic-eureka-90cdb0a4.pages.github.io/p/pl/${selectedPlaylist?.originalId}`
    },
    playlistSitePreviewUrl(selectedPlaylist: any): string {
      return `https://psychic-eureka-90cdb0a4.pages.github.io/p/pl/${selectedPlaylist?.originalId}/site`
    },
  },
})
</script>

<style lang="scss" scoped>
.mode_switch_block {
  position: relative;
  z-index: 1;
  width: 130px;
  height: 40px;
  margin: 0 0 0 auto;
}

.mode_switch {
  right: 0;
}

.episode_list {
  min-height: 30px;
}

.edit_button {
  color: white;
}

.delete_button {
  color: #4f4f4f;
}

.article_preview {
  word-wrap: break-word;
  font-size: 14px;
  width: 100%;
  padding: 20px 12px 12px;
}

.no_video {
  position: absolute;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
  font-weight: bold;
  width: 100%;
  height: 100%;
  padding: 10px;
  font-size: 12px;
}
</style>
