<template>
  <v-layout column>
    <v-row>
      <v-col cols="12">
        <div class="title mb-4">東京デッキ一覧</div>
      </v-col>
      <v-col cols="12">
        以下のプレイリストは
        <code>/d5/pl/130/deck.json</code>
        で返却されるプレイリストを、EditorialHands
        のプレイリストへ変換したものです。
        <br />
        1時間に一度、内容が最新版へ同期されます。
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
    <v-row>
      <v-col v-for="item in playlists" :key="item.id" cols="12" class="py-2">
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
      width="400"
      style="position: fixed"
    >
      <v-list-item class="pa-2">
        <v-col cols="12">
          <basic-information-view :playlist="selectedPlaylist" />
        </v-col>
      </v-list-item>
      <v-list-item
        v-for="item in selectedPlaylistItems"
        :key="item.id"
        class="px-6 episode_list"
      >
        <v-list-item-icon class="mr-1 my-1">
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
      <v-divider class="mt-4" />
      <v-list-item>
        <div class="article_preview">
          {{ selectedPlaylistArticle }}
        </div>
      </v-list-item>
      <v-list-item>
        <v-row justify="center">
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
          <v-col cols="6">
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
              <v-icon left>mdi-flask-round-bottom</v-icon>
              編集する(試用版)
            </v-btn>
          </v-col>
        </v-row>
      </v-list-item>
    </v-navigation-drawer>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import BasicInformationView from '~/components/playlists/BasicInformationView.vue'
import PlaylistItem from '~/components/common/PlaylistItem.vue'
import { Playlist } from '~/types/playlist'
import { EpisodeData } from '~/types/episode_data'

interface DataType {
  page: number
  totalVisiblePagination: number
  drawer: boolean
  selectedPlaylist: Playlist | undefined
  selectedPlaylistItems: EpisodeData[]
}

export default Vue.extend({
  name: 'PlaylistTokyoPage',
  components: { PlaylistItem, BasicInformationView },
  async asyncData({ store }) {
    await store.dispatch('playlists/fetchD5Playlists', { area: '130', page: 1 })
  },
  data(): DataType {
    return {
      page: 1,
      totalVisiblePagination: 9,
      drawer: false,
      selectedPlaylist: undefined,
      selectedPlaylistItems: [],
    }
  },
  computed: {
    playlists() {
      return this.$store.state.playlists.allItems
    },
    totalPages() {
      return this.$store.state.playlists.pagination.totalPages
    },
    selectedPlaylistId(): string {
      return this.selectedPlaylist ? this.selectedPlaylist.id : ''
    },
    selectedPlaylistArticle(): string {
      return this.selectedPlaylist?.article?.plainBody || ''
    },
  },
  watch: {
    page: {
      handler(newValue) {
        this.$store.dispatch('playlists/fetchD5Playlists', {
          area: '130',
          page: newValue,
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
      },
    },
  },
  methods: {
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
  },
})
</script>

<style lang="scss" scoped>
.edit_button {
  color: white;
}

.delete_button {
  color: #4f4f4f;
}
</style>
