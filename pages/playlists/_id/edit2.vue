<template>
  <v-layout column style="position: relative">
    <v-row style="position: relative" class="mt-4">
      <v-col cols="auto">
        <playlist-stepper :current="currentTab" @change-tab="changeTab" />
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="orange"
          class="save-button"
          elevation="0"
          style="position: absolute; right: 0"
          >保存する</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="isListEditing" cols="9" class="list-item-container mt-4">
        <list-edit-tab />
      </v-col>
      <v-col
        v-else-if="isArticleEditing"
        cols="9"
        class="article-container mt-4"
      >
        <article-edit-tab :playlist="playlist" @update-article="updateArticle"
      /></v-col>
      <v-col v-else-if="isSeriesEditing" cols="9" class="series-container mt-4">
        <series-meta-edit-tab :playlist="playlist" />
      </v-col>
      <v-col cols="3" class="preview-container">
        <div class="preview-container-inner mt-1 pa-2">
          <basic-information-view :playlist="playlist" />
          <v-col cols="12">
            <v-list dense>
              <v-list-item
                v-for="item in playlistItems"
                :key="item.id"
                class="px-0"
              >
                <v-list-item-icon class="mr-1">
                  <v-img
                    :src="eyecatchUrl(item)"
                    lazy-src="https://placehold.jp/50x28.png"
                    width="50"
                    class="episode-image"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-divider />
          article
        </div>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Playlist } from '@/types/playlist'
import ArticleEditTab from '~/components/playlists/ArticleEditTab.vue'
import ListEditTab from '~/components/playlists/ListEditTab.vue'
import PlaylistStepper from '~/components/playlists/PlaylistStepper.vue'
import BasicInformationView from '~/components/playlists/BasicInformationView.vue'
import SeriesMetaEditTab from '~/components/playlists/SeriesMetaEditTab.vue'
import { PlaylistTab } from '~/models/definitions'

interface DataType {
  currentTab: PlaylistTab
}

export default Vue.extend({
  name: 'PlaylistIdEdit2Page',
  components: {
    ArticleEditTab,
    BasicInformationView,
    ListEditTab,
    PlaylistStepper,
    SeriesMetaEditTab,
  },
  async asyncData({ store, params }) {
    await store.dispatch('playlists/fetchPlaylist', params.id)
  },
  data(): DataType {
    return {
      currentTab: PlaylistTab.article,
    }
  },
  computed: {
    playlist(): Playlist {
      return this.$store.state.playlists.editingPlaylist
    },
    playlistItems(): Array<Object> {
      return this.$store.state.playlists.editingPlaylist.items
    },
    isListEditing(): boolean {
      return this.currentTab === PlaylistTab.list
    },
    isArticleEditing(): boolean {
      return this.currentTab === PlaylistTab.article
    },
    isSeriesEditing(): boolean {
      return this.currentTab === PlaylistTab.series
    },
  },
  methods: {
    eyecatchUrl(item: any): string {
      if (item.eyecatch !== undefined) {
        return item.eyecatch.medium.url
      } else {
        return ''
      }
    },
    changeTab(nextTab: PlaylistTab) {
      this.currentTab = nextTab
    },
    updateArticle(article: any) {
      this.$store.dispatch('playlists/updateArticle', article)
    },
  },
})
</script>

<style lang="scss" scoped>
.save-button {
  color: white;
  width: 140px;
}

.list-item-container,
.article-container,
.series-container {
  background-color: white;
  border-radius: 6px;
}

.preview-container-inner {
  background-color: white;
  border-radius: 6px;
}
</style>
