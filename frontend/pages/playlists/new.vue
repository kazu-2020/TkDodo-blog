<template>
  <v-layout column style="position: relative">
    <div class="fixed-row-wrapper">
      <v-row class="fixed-row pt-2 pr-15" justify="space-between">
        <v-col cols="12" class="pt-8">
          <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
            <template #item="{ item }">
              <v-breadcrumbs-item :href="item.href" :disabled="item.disabled">
                {{ item.text }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </v-col>
        <v-col cols="9">
          <playlist-stepper
            :current="currentTab"
            :article-tab-validation="isValidArticleTab"
            :series-tab-validation="isValidSeriesTab"
            :hide-list-step="hideListStep"
            :hide-article-step="hideArticleStep"
            :has-unsaved-list="hasUnsavedList"
            :has-unsaved-article="hasUnsavedArticle"
            :has-unsaved-series="hasUnsavedSeries"
            @change-tab="changeTab"
          />
        </v-col>
        <v-spacer />
        <v-col cols="2" class="">
          <v-btn
            x-large
            block
            color="accent"
            elevation="0"
            :disabled="preventSaveButton"
            @click="save"
            >保存する</v-btn
          >
        </v-col>
      </v-row>
    </div>
    <v-row style="padding-top: 120px">
      <v-col cols="12" class="hidden-lg-and-up preview-container-wrapper">
        <horizontal-basic-information-view :playlist="playlist" />
      </v-col>
      <v-col
        v-show="isListEditing"
        cols="9"
        lg="9"
        xl="9"
        md="12"
        sm="12"
        class="mt-4 list-item-container-wrapper"
      >
        <list-edit-tab
          :playlist="playlist"
          @update-episodes="updateEpisodes"
          @add-episode="addEpisode"
          @delete-episode="deleteEpisode"
        />
      </v-col>
      <v-col
        v-show="isArticleEditing"
        cols="9"
        lg="9"
        xl="9"
        md="12"
        sm="12"
        class="mt-4 article-container-wrapper"
      >
        <article-edit-tab
          :playlist="playlist"
          @update-article="updateArticle"
          @update-validation="updateArticleTabValidation"
        />
      </v-col>
      <v-col
        v-show="isSeriesEditing"
        cols="9"
        lg="9"
        xl="9"
        md="12"
        sm="12"
        class="mt-4 series-container-wrapper"
      >
        <series-meta-edit-tab
          :playlist="playlist"
          @update-series="updateSeries"
          @update-validation="updateSeriesTabValidation"
        />
      </v-col>
      <v-col cols="3" class="preview-container-wrapper hidden-md-and-down">
        <div class="preview-container container-fluid mt-4 pa-2 white rounded">
          <basic-information-view :playlist="playlist" />
          <v-col cols="12">
            <div class="body-2 font-weight-bold">リスト</div>
            <v-list dense>
              <v-list-item
                v-for="item in playlistItems"
                :key="item.id"
                class="px-0"
              >
                <v-list-item-icon class="mr-3">
                  <v-img
                    :src="eyecatchUrl(item)"
                    lazy-src="https://placehold.jp/100x56.png"
                    width="100"
                    height="56"
                  >
                    <div
                      v-if="!hasVideo(item)"
                      class="no_video d-flex justify-center align-center"
                    >
                      <div>視聴不可</div>
                    </div>
                  </v-img>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    style="font-size: 14px"
                    v-text="item.name"
                  />
                  <v-list-item-subtitle
                    style="font-size: 12px; margin-top: 2px"
                  >
                    <span style="position: relative">
                      <img
                        :src="serviceLogoUrl(item)"
                        style="height: 12px; position: relative; top: 1px"
                      />
                    </span>
                    {{ seriesName(item) }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle
                    style="
                      font-size: 12px;
                      margin-top: 2px;
                      padding-bottom: 2px;
                    "
                  >
                    直近放送日: {{ startDate(item) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-divider />
          <v-col cols="12">
            <div style="word-wrap: break-word; font-size: 14px">
              {{ articlePlainBody }}
            </div>
          </v-col>
        </div>
      </v-col>
    </v-row>
    <article-saved-dialog
      :is-show-dialog="isShowDiffDialog"
      :playlist="playlist"
      :diff-items="diffEpisodeItems"
      @hide-new-playlist-dialog="isShowDiffDialog = false"
      @move-to-list-editing="moveToListEditing"
    />
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { Playlist } from '@/types/playlist'
import { EpisodeData } from '@/types/episode_data'
import ArticleEditTab from '~/components/playlists/ArticleEditTab.vue'
import ListEditTab from '~/components/playlists/ListEditTab.vue'
import PlaylistStepper from '~/components/playlists/PlaylistStepper.vue'
import BasicInformationView from '~/components/playlists/BasicInformationView.vue'
import HorizontalBasicInformationView from '~/components/playlists/HorizontalBasicInformationView.vue'
import SeriesMetaEditTab from '~/components/playlists/SeriesMetaEditTab.vue'
import { PlaylistTab } from '~/models/definitions'
import unloadAlertMixin from '~/components/common/unloadAlertMixin'
import ArticleSavedDialog from '~/components/playlists/ArticleSavedDialog.vue'
import ParseEpisodeHelper from '~/utils/ParseEpisodeHelper'

interface Breadcrumb {
  text: string
  disabled: boolean
  href: string
}

interface DataType {
  playlist: Partial<Playlist>
  currentTab: PlaylistTab
  hasUnsavedList: boolean
  hasUnsavedArticle: boolean
  hasUnsavedSeries: boolean
  isValidArticleTab: boolean
  isValidSeriesTab: boolean
  isShowDiffDialog: boolean
}

export default Vue.extend({
  name: 'PlaylistNewPage',
  components: {
    ArticleEditTab,
    BasicInformationView,
    HorizontalBasicInformationView,
    ListEditTab,
    PlaylistStepper,
    SeriesMetaEditTab,
    ArticleSavedDialog,
  },
  mixins: [unloadAlertMixin],
  data(): DataType {
    return {
      playlist: {
        article: { body: undefined },
        items: [],
        deliverItemListViaApi: true,
        deliverEpisodeViaApi: true,
      },
      currentTab: PlaylistTab.list,
      hasUnsavedList: false,
      hasUnsavedArticle: false,
      hasUnsavedSeries: false,
      isValidArticleTab: true,
      isValidSeriesTab: true,
      isShowDiffDialog: false,
    }
  },
  computed: {
    playlistItems(): Array<Object> {
      return this.playlist.items || []
    },
    isListEditing(): boolean {
      return this.currentTab === PlaylistTab.list && !this.hideListStep
    },
    isArticleEditing(): boolean {
      return this.currentTab === PlaylistTab.article && !this.hideArticleStep
    },
    isSeriesEditing(): boolean {
      return this.currentTab === PlaylistTab.series
    },
    preventSaveButton(): boolean {
      return !this.isValidArticleTab || !this.isValidSeriesTab
    },
    breadcrumbItems(): Breadcrumb[] {
      return [
        {
          text: 'プレイリスト一覧',
          disabled: false,
          href: '/',
        },
        {
          text: '新規作成',
          disabled: true,
          href: '#',
        },
      ]
    },
    diffEpisodeItems(): EpisodeData[] {
      const playlistItems = this.playlist.items || []
      const articleItems = this.playlist.article?.containsEpisodes || []

      const diffItems = articleItems.filter(
        (v: any) => !playlistItems.map((x) => x.id).includes(v.id)
      )

      return diffItems
    },
    articlePlainBody(): string | undefined {
      return this.playlist.article?.plainBody
    },
    hideListStep(): boolean {
      return this.$route.query.mode === 'article'
    },
    hideArticleStep(): boolean {
      return this.$route.query.mode === 'list'
    },
  },
  watch: {
    '$route.query.mode'(newValue) {
      this.currentTab = PlaylistTab[newValue as keyof typeof PlaylistTab]
    },
  },
  mounted() {
    ;(this as any).notShowUnloadAlert()
    const hash = this.$route.hash
    if (hash && hash.match(/^#(list|article|series)$/)) {
      this.currentTab = hash.slice(1) as PlaylistTab
    }
    const mode = this.$route.query.mode
    if (mode) {
      this.currentTab = PlaylistTab[mode as keyof typeof PlaylistTab]
    }
  },
  methods: {
    startDate(item: any): string {
      const date = item?.detailedRecentEvent?.startDate || ''

      if (date.length === 0) {
        return '-'
      } else {
        moment.locale('ja')
        return moment(date).format('YYYY年MM月DD日(ddd) HH:mm')
      }
    },
    eyecatchUrl(item: any): string {
      if (item?.eyecatch !== undefined) {
        return item.eyecatch.medium.url
      }
      if (item?.partOfSeries?.eyecatch !== undefined) {
        return item.partOfSeries.eyecatch.medium.url
      }

      return 'https://placehold.jp/50x28.png'
    },
    hasVideo(episode: any) {
      return ParseEpisodeHelper.hasVideo(episode)
    },
    serviceLogoUrl(item: any) {
      return item?.releasedEvent?.publishedOn?.images?.badgeSmall?.url || ''
    },
    seriesName(item: any): string {
      return item?.partOfSeries?.name || ''
    },
    changeTab(nextTab: PlaylistTab) {
      this.currentTab = nextTab
    },
    resetUnloadAlert(): void {
      if (this.currentTab !== PlaylistTab.list) return
      this.hasUnsavedList = true
      ;(this as any).showUnloadAlert()
    },
    updateEpisodes(episodes: any) {
      this.resetUnloadAlert()
      this.playlist.items = episodes
    },
    addEpisode(episode: any) {
      this.resetUnloadAlert()
      this.playlist.items?.push(episode)
    },
    deleteEpisode(episode: any) {
      this.resetUnloadAlert()
      this.playlist.items?.splice(this.playlist.items?.indexOf(episode), 1)
    },
    updateArticle(article: any) {
      if (this.currentTab === PlaylistTab.article) {
        ;(this as any).showUnloadAlert()
        this.hasUnsavedArticle = true
      }
      this.playlist.article = article
    },
    updateSeries(playlist: any) {
      if (this.currentTab === PlaylistTab.series) {
        ;(this as any).showUnloadAlert()
        this.hasUnsavedSeries = true
      }
      this.playlist = playlist
    },
    updateArticleTabValidation(valid: boolean) {
      this.isValidArticleTab = valid
    },
    updateSeriesTabValidation(valid: boolean) {
      this.isValidSeriesTab = valid
    },
    moveToListEditing() {
      this.currentTab = PlaylistTab.list
      this.isShowDiffDialog = false
    },
    save() {
      const body: { [key: string]: string | undefined | boolean } = {
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
        deliver_item_list_via_api: this.playlist.deliverItemListViaApi,
        deliver_episode_via_api: this.playlist.deliverEpisodeViaApi,
        deliver_article_via_api: this.playlist.deliverArticleViaApi,
        deliver_how_to_via_api: this.playlist.deliverHowToViaApi,
        deliver_event_via_api: this.playlist.deliverEventViaApi,
        deliver_faq_page_via_api: this.playlist.deliverFaqPageViaApi,
        marked_header: this.playlist.article?.header,
        editor_data: JSON.stringify(this.playlist.article?.body),
        marked_footer: this.playlist.article?.footer,
        author_type: this.playlist.article?.authorType || 'Organization',
        author_name: this.playlist.article?.authorName || 'NHK',
        publisher_name: this.playlist.article?.publisherName || 'デジタルラボ',
        publisher_type: this.playlist.article?.publisherType || 'Organization',
        layout_pattern: this.playlist.layoutPattern,
        publish_level: this.playlist.publishLevel,
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

      if (this.playlist.items && this.playlist.items.length > 0) {
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

      if (this.playlist.sameAs) {
        for (const sameAs of this.playlist.sameAs) {
          if (sameAs.id) {
            data.append(
              'playlist[same_as_attributes][][id]',
              sameAs.id.toString()
            )
          }
          if (sameAs.name) {
            data.append('playlist[same_as_attributes][][name]', sameAs.name)
          }
          if (sameAs.url) {
            data.append('playlist[same_as_attributes][][url]', sameAs.url)
          }
          if (sameAs._destroy) {
            data.append(
              'playlist[same_as_attributes][][_destroy]',
              sameAs._destroy.toString()
            )
          }
        }
      }

      if (this.playlist.citations) {
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
      }

      this.$store.dispatch('loading/startLoading', {
        success: '保存しました',
        error: '保存失敗しました',
      })

      this.$axios
        .post(`/playlists`, data)
        .then((response) => {
          this.$store.dispatch('loading/succeedLoading')
          this.playlist = (response as any).data.playlist
          ;(this as any).notShowUnloadAlert()

          if ((this as any).diffEpisodeItems.length !== 0) {
            ;(this as any).isShowDiffDialog = true
          }
          this.hasUnsavedList = false
          this.hasUnsavedArticle = false
          this.hasUnsavedSeries = false

          this.$router.push(`/playlists/${this.playlist.playlistUId}`)
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
  background-color: #f0f0f0;
  padding-top: 20px;
}

.save-button {
  width: 140px;
}

.v-responsive.v-image.episode-image {
  border-radius: 5px;
}
</style>
