<template>
  <v-layout column>
    <v-row>
      <v-col cols="12">
        <div class="title mb-4">
          東京デッキ一覧
        </div>
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
    <v-row>
      <v-col
        v-for="item in playlists"
        :key="item.id"
        xs="12"
        sm="12"
        md="6"
        lg="6"
        xl="4"
      >
        <playlist-item :playlist="item" @delete-playlist="deletePlaylist" />
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import PlaylistItem from '~/components/PlaylistItem.vue'

export default Vue.extend({
  name: 'PlaylistIndexComponent',
  components: { PlaylistItem },
  async asyncData({ store }) {
    await store.dispatch('playlists/fetchD5Playlists', '130')
  },
  computed: {
    playlists() {
      return this.$store.state.playlists.allItems
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
