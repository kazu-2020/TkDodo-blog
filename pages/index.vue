<template>
  <v-layout column>
    <v-row justify="center">
      <v-col cols="11">
        <v-row justify="space-between">
          <v-col cols="6">
            <div class="title mb-4">プレイリスト一覧</div>
          </v-col>
          <v-col cols="2">
            <div class="mode_switch_block">
              <v-switch
                v-model="articleMode"
                label="記事モード"
                class="mode_switch"
              />
            </div>
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
        <article-item :playlist="item" @delete-playlist="deletePlaylist" />
      </v-col>
    </v-row>
    <v-row v-else justify="center">
      <v-col v-for="item in playlists" :key="item.id" cols="11" class="py-1">
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
import ArticleItem from '~/components/playlists/ArticleItem.vue'

interface DataType {
  page: number
  totalVisiblePagination: number
  articleMode: boolean
}

export default Vue.extend({
  name: 'PlaylistIndexPage',
  components: { PlaylistItem, ArticleItem },
  async asyncData({ store }) {
    await store.dispatch('playlists/fetchPlaylists', 1)
  },
  data(): DataType {
    return {
      page: 1,
      totalVisiblePagination: 9,
      articleMode: (this as any).$cookies.get('articleMode'),
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
    articleMode: {
      handler(newValue) {
        ;(this as any).$cookies.set('articleMode', newValue, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
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

<style lang="scss" scoped>
.mode_switch_block {
  position: relative;
}

.mode_switch {
  position: absolute;
  right: 0;
}
</style>
