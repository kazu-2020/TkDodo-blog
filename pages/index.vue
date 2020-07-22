<template>
  <v-layout column>
    <v-row>
      <v-col>
        <div class="title mb-4">
          プレイリスト一覧
        </div>
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
  name: 'PlaylistIndexPage',
  components: { PlaylistItem },
  async asyncData({ store }) {
    await store.dispatch('playlists/fetchPlaylists')
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
