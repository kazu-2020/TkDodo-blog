<template>
  <v-layout column>
    <v-row justify="center">
      <v-col cols="11">
        <v-row justify="space-between">
          <v-col cols="6">
            <div class="title mb-4 pt-2">プレイリスト一覧</div>
          </v-col>
          <v-col cols="2">
            <div class="mode_switch_block">
              <v-switch
                v-model="articleMode"
                label="記事モード"
                class="mode_switch"
              />
            </div>
            <v-select
              v-model="selectedPublishedStateFilter"
              :items="publishedStateFilters"
              item-text="text"
              item-value="state"
              class="pt-16"
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
        <playlist-item
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
          <basic-information-view :playlist="selectedPlaylist" />
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
        </v-row>
      </v-list-item>
      <v-list-item
        v-for="item in selectedPlaylistItems"
        :key="item.id"
        class="px-6 episode_list"
      >
        <v-list-item-icon class="mr-3 my-3">
          <v-img
            :src="eyecatchUrl(item)"
            lazy-src="https://placehold.jp/50x28.png"
            width="50"
            height="28"
            class="episode-image"
          />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title style="font-size: 14px" v-text="item.name" />
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
          {{ selectedPlaylistArticle }}
        </div>
      </v-list-item>
    </v-navigation-drawer>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import ActorContributorList from '../components/playlists/ActorContributorList.vue'
import PlaylistItem from '~/components/common/PlaylistItem.vue'
import ArticleItem from '~/components/playlists/ArticleItem.vue'
import BasicInformationView from '~/components/playlists/BasicInformationView.vue'
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
  selectedPublishedStateFilter: Object
}

export default Vue.extend({
  name: 'PlaylistIndexPage',
  components: {
    PlaylistItem,
    ActorContributorList,
    ArticleItem,
    BasicInformationView,
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
      selectedPublishedStateFilter: { state: 'draft', text: '下書きのみ' },
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
      return this.selectedPlaylist?.article?.plainBody || ''
    },
    selectedPlaylistId(): string {
      return this.selectedPlaylist ? this.selectedPlaylist.id : ''
    },
    drawerWidth(): number {
      const halfSize = this.width * 0.6
      return Math.min(halfSize, 500)
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
        { state: '', text: '非公開を含む全て' },
      ]
    },
  },
  watch: {
    page: {
      handler(newValue) {
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
        this.$store.dispatch('playlists/fetchPlaylists', {
          page: 1,
          publishedState: newValue,
        })
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
      this.$store.dispatch('loading/startLoading', {
        success: '削除しました',
        error: '削除失敗しました',
      })
      this.$store.dispatch('playlists/deletePlaylist', this.selectedPlaylist)
      this.drawer = false
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
        return 'https://placehold.jp/50x28.png'
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
  },
})
</script>

<style lang="scss" scoped>
.mode_switch_block {
  position: relative;
  z-index: 1;
}

.mode_switch {
  position: absolute;
  right: 0;
}

.episode_list {
  min-height: 30px;
}

.v-responsive.v-image.episode-image {
  border-radius: 5px;
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
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
