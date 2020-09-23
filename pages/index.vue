<template>
  <v-layout column>
    <v-row>
      <v-col>
        <div class="title mb-4">プレイリスト一覧</div>
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
import PlaylistItem from '~/components/PlaylistItem.vue'

interface DataType {
  page: number
  totalVisiblePagination: number
}

export default Vue.extend({
  name: 'PlaylistIndexPage',
  components: { PlaylistItem },
  async asyncData({ store }) {
    await store.dispatch('playlists/fetchPlaylists', 1)
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
        this.$store.dispatch('playlists/fetchPlaylists', newValue)
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
