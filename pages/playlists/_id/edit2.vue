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
          @click="save"
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
        <series-meta-edit-tab
          :playlist="playlist"
          @update-series="updateSeries"
        />
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
          <v-col cols="12">
            {{ playlist.article.plainBody }}
          </v-col>
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
      currentTab: PlaylistTab.list,
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
    updateSeries(playlist: any) {
      this.$store.dispatch('playlists/updateEditingPlaylist', playlist)
    },
    save() {
      const body: { [key: string]: string | undefined } = {
        name: this.playlist.name,
        detailed_name_ruby: this.playlist.detailedNameRuby,
        description: this.playlist.description,
        detailed_catch: this.playlist.detailedCatch,
        format_genre_code: this.playlist.formatGenre,
        theme_genre_code: this.playlist.themeGenre,
        selected_palette: this.playlist.selectedPalette,
        primary_light_color: this.playlist.primaryLightColor,
        primary_dark_color: this.playlist.primaryDarkColor,
        text_light_color: this.playlist.textLightColor,
        text_dark_color: this.playlist.textDarkColor,
        link_light_color: this.playlist.linkLightColor,
        link_dark_color: this.playlist.linkDarkColor,
        reserve_publish_time_at: this.playlist.reservePublishTimeAt,
        reserve_finish_time_at: this.playlist.reserveFinishTimeAt,
        alias_id: this.playlist.aliasId,
        remove_logo_image: this.playlist.removeLogoImage?.toString(),
        remove_eyecatch_image: this.playlist.removeEyecatchImage?.toString(),
        remove_hero_image: this.playlist.removeHeroImage?.toString(),
        marked_header: this.playlist.article.header,
        editor_data: JSON.stringify(this.playlist.article.body),
        marked_footer: this.playlist.article.footer,
        author_type: this.playlist.article.authorType,
        author_name: this.playlist.article.authorName,
        publisher_name: this.playlist.article.publisherName,
        publisher_type: this.playlist.article.publisherType,
      }

      if (this.playlist.logoImageData) {
        Object.assign(body, {
          logo_image: this.playlist.logoImageData,
        })
      }
      if (this.playlist.eyecatchImageData) {
        Object.assign(body, {
          eyecatch_image: this.playlist.eyecatchImageData,
        })
      }
      if (this.playlist.heroImageData) {
        Object.assign(body, {
          hero_image: this.playlist.heroImageData,
        })
      }
      const data = new FormData()

      // このパラメーターを有効にすることで、Playlists#update でエピソードの更新もできるようにする
      data.append('enable_list_update', '1')

      for (const key in body) {
        if (body[key] !== null && body[key] !== undefined) {
          data.append(`playlist[${key}]`, body[key] as string)
        }
      }

      if (this.playlist.items.length > 0) {
        for (const item of this.playlist.items) {
          data.append('playlist[items][]', item.id as string)
        }
      }

      if (this.playlist.keywords) {
        for (const keyword of this.playlist.keywords) {
          data.append('playlist[keywords][]', keyword)
        }
      }

      if (this.playlist.hashtag) {
        for (const hash of this.playlist.hashtag) {
          data.append('playlist[hashtags][]', hash)
        }
      }

      if (this.playlist.sameAs?.id) {
        data.append(
          'playlist[same_as_attributes][id]',
          this.playlist.sameAs.id.toString()
        )
      }
      if (this.playlist.sameAs?.name) {
        data.append(
          'playlist[same_as_attributes][name]',
          this.playlist.sameAs?.name
        )
      }
      if (this.playlist.sameAs?.url) {
        data.append(
          'playlist[same_as_attributes][url]',
          this.playlist.sameAs.url
        )
      }
      if (this.playlist.sameAs?._destroy) {
        data.append(
          'playlist[same_as_attributes][_destroy]',
          this.playlist.sameAs._destroy.toString()
        )
      }

      for (const citation of this.playlist.citations) {
        if (citation.id) {
          data.append(
            'playlist[citations_attributes][][id]',
            citation.id.toString()
          )
        }
        if (citation.name) {
          data.append('playlist[citations_attributes][][name]', citation.name)
        }
        if (citation.url) {
          data.append('playlist[citations_attributes][][url]', citation.url)
        }
        if (citation._destroy) {
          data.append(
            'playlist[citations_attributes][][_destroy]',
            citation._destroy.toString()
          )
        }
      }

      this.$axios
        .put(`/playlists/${this.playlist.id}`, data)
        .then((_response) => {
          this.$store.dispatch('loading/succeedLoading')
        })
        .catch((_error) => {
          this.$store.dispatch('loading/failLoading')
        })
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
