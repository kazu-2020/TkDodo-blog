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
      <v-col v-for="item in playlists" :key="item.id" cols="12">
        <playlist-item :playlist="item" @delete-playlist="deletePlaylist" />
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
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import PlaylistItem from '~/components/common/PlaylistItem.vue'

interface DataType {
  page: number
  totalVisiblePagination: number
}

export default Vue.extend({
  name: 'PlaylistTokyoPage',
  components: { PlaylistItem },
  async asyncData({ store }) {
    await store.dispatch('playlists/fetchD5Playlists', { area: '130', page: 1 })
  },
  data(): DataType {
    return {
      page: 1,
      totalVisiblePagination: 9,
    }
  },
  computed: {
    playlists() {
      return this.$store.state.playlists.allItems
    },
    totalPages() {
      return this.$store.state.playlists.pagination.totalPages
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
  },
  methods: {
    deletePlaylist(playlist: any) {
      this.$store.dispatch('loading/startLoading', {
        success: '削除しました',
        error: '削除失敗しました',
      })
      this.$store.dispatch('playlists/deletePlaylist', playlist)
    },
  },
})
</script>
