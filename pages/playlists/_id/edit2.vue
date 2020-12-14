<template>
  <v-layout column style="position: relative">
    <div class="fixed-row-wrapper">
      <v-row
        class="fixed-row"
        justify="space-between"
        style="padding-right: 60px"
      >
        <v-col cols="auto">
          <playlist-stepper
            :current="currentTab"
            :article-tab-validation="isValidArticleTab"
            :series-tab-validation="isValidSeriesTab"
            @change-tab="changeTab"
          />
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="orange"
            class="save-button"
            elevation="0"
            :disabled="preventSaveButton"
            @click="save"
            >保存する</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <v-row style="padding-top: 80px">
      <v-col cols="12" class="hidden-lg-and-up preview-container">
        <horizontal-basic-information-view :playlist="playlist" />
      </v-col>
      <v-col
        v-show="isListEditing"
        cols="9"
        lg="9"
        xl="9"
        md="12"
        sm="12"
        class="list-item-container mt-4"
      >
        <list-edit-tab @update-episodes-list="updateEpisodeList" />
      </v-col>
      <v-col
        v-show="isArticleEditing"
        cols="9"
        lg="9"
        xl="9"
        md="12"
        sm="12"
        class="article-container mt-4"
      >
        <article-edit-tab
          :playlist="playlist"
          @update-article="updateArticle"
          @update-validation="updateArticleTabValidation"
      /></v-col>
      <v-col
        v-show="isSeriesEditing"
        cols="9"
        lg="9"
        xl="9"
        md="12"
        sm="12"
        class="series-container mt-4"
      >
        <series-meta-edit-tab
          :playlist="playlist"
          @update-series="updateSeries"
          @update-validation="updateSeriesTabValidation"
        />
      </v-col>
      <v-col cols="3" class="preview-container hidden-md-and-down">
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
                    height="28"
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
            <div style="word-wrap: break-word; font-size: 14px">
              {{ playlist.article.plainBody }}
            </div>
          </v-col>
          <v-divider />
          <v-col cols="2">
            <playlist-json-dialog
              button-color="#000000"
              :playlist-id="playlist.id"
              v-bind="attrs"
              v-on="on"
            />
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
import PlaylistJsonDialog from '~/components/playlists/PlaylistJsonDialog.vue'
import PlaylistStepper from '~/components/playlists/PlaylistStepper.vue'
import BasicInformationView from '~/components/playlists/BasicInformationView.vue'
import HorizontalBasicInformationView from '~/components/playlists/HorizontalBasicInformationView.vue'
import SeriesMetaEditTab from '~/components/playlists/SeriesMetaEditTab.vue'
import { PlaylistTab } from '~/models/definitions'
import unloadAlertMixin from '~/components/common/unloadAlertMixin.ts'

interface DataType {
  currentTab: PlaylistTab
  isValidArticleTab: boolean
  isValidSeriesTab: boolean
}

export default Vue.extend({
  name: 'PlaylistIdEdit2Page',
  components: {
    ArticleEditTab,
    BasicInformationView,
    HorizontalBasicInformationView,
    ListEditTab,
    PlaylistJsonDialog,
    PlaylistStepper,
    SeriesMetaEditTab,
  },
  mixins: [unloadAlertMixin],
  async asyncData({ store, params }) {
    await store.dispatch('playlists/fetchPlaylist', params.id)
  },
  data(): DataType {
    return {
      currentTab: PlaylistTab.list,
      isValidArticleTab: true,
      isValidSeriesTab: true,
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
    preventSaveButton(): boolean {
      return !this.isValidArticleTab || !this.isValidSeriesTab
    },
  },
  mounted() {
    ;(this as any).notShowUnloadAlert()
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
    updateEpisodeList() {
      if (this.currentTab !== PlaylistTab.list) return
      ;(this as any).showUnloadAlert()
    },
    updateArticle(article: any) {
      if (this.currentTab === PlaylistTab.article) {
        ;(this as any).showUnloadAlert()
      }
      this.$store.dispatch('playlists/updateArticle', article)
    },
    updateSeries(playlist: any) {
      if (this.currentTab === PlaylistTab.series) {
        ;(this as any).showUnloadAlert()
      }
      this.$store.dispatch('playlists/updateEditingPlaylist', playlist)
    },
    updateArticleTabValidation(valid: boolean) {
      this.isValidArticleTab = valid
    },
    updateSeriesTabValidation(valid: boolean) {
      this.isValidSeriesTab = valid
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
          ;(this as any).notShowUnloadAlert()
        })
        .catch((_error) => {
          this.$store.dispatch('loading/failLoading')
        })
    },
  },
})
</script>

<style lang="scss" scoped>
.fixed-row-wrapper {
  position: absolute;
  top: -12px;
}

.fixed-row {
  position: fixed;
  width: 100%;
  z-index: 4;
  background-color: #f3f3f3;
  padding-top: 20px;
}

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

.v-responsive.v-image.episode-image {
  border-radius: 5px;
}
</style>
