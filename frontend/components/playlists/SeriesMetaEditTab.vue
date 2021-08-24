<template>
  <div class="series-container container-fluid white rounded px-5 py-2">
    <v-row>
      <v-col cols="12">
        <v-form ref="form" v-model="valid">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="名前 - Name"
                class="playlist_name"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="detailedNameRuby"
                label="ふりがな - Detailed Name Ruby"
                class="detailed_name_ruby"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="detailedCatch"
                name="catch"
                rows="3"
                label="キャッチコピー - Detailed Catch"
                class="detailed_catch"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="description"
                name="catch"
                rows="5"
                label="説明 - Description"
                class="description"
                counter
              />
            </v-col>

            <v-col cols="12">
              <v-combobox
                v-model="keywords"
                :items="[]"
                hide-selected
                label="キーワード - Keywords"
                class="keywords"
                multiple
                persistent-hint
                small-chips
              >
                <template #selection="{ attrs, item, parent, selected }">
                  <v-chip v-bind="attrs" :input-value="selected" label small>
                    <span class="pr-2">
                      {{ item }}
                    </span>
                    <v-icon small @click="parent.selectItem(item)"
                      >mdi-close
                    </v-icon>
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>

            <v-col cols="12">
              <v-combobox
                v-model="hashtag"
                :items="[]"
                hide-selected
                label="ハッシュタグ - Hashtag"
                hint="タグの先頭に「#」をつけてください。"
                class="hashtags"
                multiple
                persistent-hint
                small-chips
              >
                <template #selection="{ attrs, item, parent, selected }">
                  <v-chip v-bind="attrs" :input-value="selected" label small>
                    <span class="pr-2">
                      {{ item }}
                    </span>
                    <v-icon small @click="parent.selectItem(item)"
                      >mdi-close
                    </v-icon>
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>
            <v-row flex-start>
              <v-col cols="6" md="3">
                <v-select
                  v-model="formatGenre"
                  :items="formatGenreList"
                  class="format_genre_select"
                  label="ジャンル(フォーマット) - Format Genre"
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-select
                  v-model="themeGenre"
                  :items="themeGenreList"
                  label="ジャンル(テーマ) - Theme Genre"
                  class="theme_genre_select"
                />
              </v-col>
            </v-row>
          </v-row>

          <v-row dense class="my-5">
            <v-col cols="12">
              <h3>画像</h3>
            </v-col>
            <series-images-form
              :playlist="playlist"
              @update-series-image="updateSeriesImage"
              @remove-series-image="removeSeriesImage"
            />
          </v-row>

          <!-- 色 -->
          <v-row dense class="my-5">
            <v-col cols="12">
              <h3>色 - Color</h3>
              <p class="mb-0">
                ここで選んだ色がアクセシビリティに配慮された色に変換されページに反映されます。
                <br />
                一番右側のパレットから自由に色を選択することができます。
              </p>
            </v-col>
            <color-palette :selected-palette.sync="selectedPalette" />
          </v-row>

          <!-- sameAs -->
          <v-row dense class="my-5">
            <v-col cols="12">
              <h3>
                リンク(同一内容)<small class="text--secondary"> - SameAs</small>
              </h3>
            </v-col>
            <same-as-form :same-as.sync="sameAs" />
          </v-row>
          <!-- citations -->
          <v-row dense class="my-5">
            <v-col cols="12">
              <h3>
                関連リンク<small class="text--secondary"> - Citation</small>
              </h3>
            </v-col>
            <citations-form :citations.sync="citations" />
          </v-row>

          <v-row dense class="my-5">
            <v-col cols="12">
              <h3>短縮URL<small class="text--secondary"> - Alias Id</small></h3>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="aliasId"
                :rules="aliasIdRules"
                hint="半角英数字、「-」「_」が利用できます"
                maxlength="255"
              />
            </v-col>
          </v-row>
          <v-row dense class="my-5">
            <v-col cols="12">
              <h3>d6.6 API への公開/非公開</h3>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-checkbox v-model="publishedState" label="公開する" />
            </v-col>
          </v-row>
          <v-row dense class="my-5">
            <v-col cols="12"><h3>Type ごとのAPI出力 ON/OFF</h3></v-col>
            <v-col cols="12" sm="6" md="3" class="type-switch">
              <v-checkbox
                v-model="selectedTypes"
                class="mt-1"
                label="NItemList"
                value="itemlist"
              />
              <v-checkbox
                v-model="selectedTypes"
                class="mt-0 ml-10"
                :label="`TVEpisode (${episodeCount})`"
                value="tvepisode"
                :disabled="disableItemListSubset"
              />
              <v-checkbox
                v-if="hasFaqPage"
                v-model="selectedTypes"
                class="mt-0 ml-10"
                :label="`FAQPage (${faqPageCount})`"
                value="faqpage"
                :disabled="disableItemListSubset"
              />
              <v-checkbox
                v-if="hasHowTo"
                v-model="selectedTypes"
                class="mt-0 ml-10"
                :label="`HowTo (${howToCount})`"
                value="howto"
                :disabled="disableItemListSubset"
              />
              <v-checkbox
                v-if="hasEvent"
                v-model="selectedTypes"
                class="mt-0 ml-10"
                :label="`Event (${eventCount})`"
                value="event"
                :disabled="disableItemListSubset"
              />
              <v-checkbox
                v-if="hasArticle"
                v-model="selectedTypes"
                class="mt-0"
                label="NArticle"
                value="narticle"
              />
            </v-col>
          </v-row>
          <v-row dense class="my-5">
            <v-col cols="12"><h3>Layout pattern</h3></v-col>
            <v-col cols="12">
              <v-radio-group v-model="layoutPattern" mandatory row>
                <v-radio label="summary" value="summary" />
                <v-radio label="itemList" value="itemList" />
                <v-radio label="featuredItem" value="featuredItem" />
                <v-radio label="largeImage" value="largeImage" />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  adjustPrimaryDarkColor,
  adjustPrimaryLightColor,
  adjustLinkDarkColor,
  adjustLinkLightColor,
} from '@/utils/adjustColor'
import qs from 'qs'
import ColorPalette from '~/components/playlists/ColorPalette.vue'
import SeriesImagesForm from '~/components/playlists/SeriesImagesForm.vue'
import SameAsForm from '~/components/playlists/SameAsForm.vue'
import CitationsForm from '~/components/playlists/CitationsForm.vue'

interface DataType {
  name: string
  detailedNameRuby: string
  detailedCatch: string
  description: string
  keywords: string[]
  hashtag: string[]
  formatGenre: string
  themeGenre: string
  selectedPalette: string
  primaryLightColor: string
  primaryDarkColor: string
  linkLightColor: string
  linkDarkColor: string
  aliasId: string
  sameAs: Object
  citations: Object[]
  layoutPattern: string
  valid: boolean
  nameRules: Function[]
  aliasIdRules: Function[]
  formatGenreList: Object[]
  themeGenreList: Object[]
  publishedState: boolean
  selectedTypes: string[]
  episodeCount: number
  faqPageCount: number
  howToCount: number
  eventCount: number
}

export default Vue.extend({
  name: 'SeriesMetaEditTab',
  components: {
    ColorPalette,
    CitationsForm,
    SeriesImagesForm,
    SameAsForm,
  },
  props: {
    playlist: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data(): DataType {
    const selectedTypes = []
    if (this.playlist.outputItemListToBundle) selectedTypes.push('itemlist')
    if (this.playlist.outputEpisodeToBundle) selectedTypes.push('tvepisode')
    if (this.playlist.outputArticleToBundle) selectedTypes.push('narticle')
    if (this.playlist.outputHowToToBundle) selectedTypes.push('howto')
    if (this.playlist.outputEventToBundle) selectedTypes.push('event')
    if (this.playlist.outputFaqPageToBundle) selectedTypes.push('faqpage')

    return {
      name: this.playlist.name || '',
      detailedNameRuby: this.playlist.detailedNameRuby || '',
      detailedCatch: this.playlist.detailedCatch || '',
      description: this.playlist.description || '',
      keywords: this.playlist.keywords || [],
      hashtag: this.playlist.hashtag || [],
      formatGenre: this.playlist.formatGenre || '',
      themeGenre: this.playlist.themeGenre || '',
      selectedPalette: this.playlist.selectedPalette || '#ffffff',
      primaryLightColor: this.playlist.primaryLightColor || '#ffffff',
      primaryDarkColor: this.playlist.primaryDarkColor || '#ffffff',
      linkLightColor: this.playlist.linkLightColor || '#ffffff',
      linkDarkColor: this.playlist.linkDarkColor || '#ffffff',
      sameAs: this.playlist.sameAs || {
        id: null,
        name: null,
        url: null,
        _destroy: 0,
      },
      citations: this.playlist.citations || [],
      aliasId: this.playlist.aliasId || '',
      valid: true,
      layoutPattern: this.playlist.layoutPattern || 'summary',
      nameRules: [
        (v: string) => !!v || '名前は必ず入力してください',
        (v: string) =>
          (v && v.length <= 255) || '名前は255文字以下で入力してください',
      ],
      aliasIdRules: [
        (v: string) =>
          /^[\s]*[-_a-zA-Z\d]*[\s]*$/.test(v) ||
          '短縮URLに利用できない文字が入力されています',
        (v: string) => {
          if (v == null) return true
          return v.length <= 255 || '短縮URLは255文字以下で入力してください'
        },
      ],
      formatGenreList: [
        { value: '00', text: 'ジャンルレス' },
        { value: '01', text: '報道' },
        { value: '02', text: 'ドキュメンタリー' },
        { value: '03', text: 'ドラマ' },
        { value: '04', text: 'アニメ' },
        { value: '05', text: 'バラエティ' },
        { value: '06', text: '映画' },
        { value: '08', text: 'PR・お知らせ' },
        { value: '09', text: '講座' },
      ],
      themeGenreList: [
        { value: '020', text: 'スポーツ全般' },
        { value: '070', text: '音楽全般' },
        { value: '092', text: '自然' },
        { value: '093', text: '科学' },
        { value: '096', text: '芸術' },
        { value: '110', text: '福祉全般' },
      ],
      publishedState: this.playlist.publishedState === 'draft',
      selectedTypes,
      episodeCount: 0,
      faqPageCount: 0,
      howToCount: 0,
      eventCount: 0,
    }
  },
  computed: {
    convertedPublishedState(): string {
      return this.publishedState ? 'draft' : 'secret'
    },
    hasArticle(): boolean {
      return (
        this.playlist.article.header ||
        this.playlist.article.plainBody ||
        this.playlist.article.footer
      )
    },
    hasHowTo(): boolean {
      return this.playlist.hasHowTo
    },
    hasFaqPage(): boolean {
      return this.playlist.hasFaqPage
    },
    hasEvent(): boolean {
      return this.playlist.hasEvent
    },
    disableItemListSubset(): boolean {
      return !this.playlist.outputItemListToBundle
    },
    episodeIds(): string[] {
      return this.playlist.items.map((item: any) => item.id)
    },
  },
  watch: {
    playlist: {
      handler(newVal) {
        this.name = newVal.name
        this.detailedNameRuby = newVal.detailedNameRuby
        this.detailedCatch = newVal.detailedCatch
        this.description = newVal.description
        this.keywords = newVal.keywords
        this.hashtag = newVal.hashtag
        this.formatGenre = newVal.formatGenre
        this.themeGenre = newVal.themeGenre
        this.selectedPalette = newVal.selectedPalette || '#FFFFFF'
        this.primaryLightColor = newVal.primaryLightColor || '#FFFFFF'
        this.primaryDarkColor = newVal.primaryDarkColor || '#FFFFFF'
        this.linkLightColor = newVal.linkLightColor || '#FFFFFF'
        this.linkDarkColor = newVal.linkDarkColor || '#FFFFFF'
        this.sameAs = newVal.sameAs
        this.citations = newVal.citations
        this.aliasId = newVal.aliasId
        this.publishedState = newVal.publishedState === 'draft'
        this.layoutPattern = newVal.layoutPattern

        this.fetchBundleItemCount()
      },
      deep: true,
    },
    name: {
      handler(newVal) {
        if (this.playlist.name === newVal) return
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, { name: newVal })
        this.$emit('update-series', playlist)
      },
    },
    detailedNameRuby: {
      handler(newVal) {
        if (this.playlist.detailedNameRuby === newVal) return
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, {
          detailedNameRuby: newVal,
        })
        this.$emit('update-series', playlist)
      },
    },
    detailedCatch: {
      handler(newVal) {
        if (this.playlist.detailedCatch === newVal) return
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, {
          detailedCatch: newVal,
        })
        this.$emit('update-series', playlist)
      },
    },
    description: {
      handler(newVal) {
        if (this.playlist.description === newVal) return
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, {
          description: newVal,
        })
        this.$emit('update-series', playlist)
      },
    },
    keywords: {
      handler(newVal) {
        const trimmedKeywords = this.trimKeywordHash(newVal)
        if (trimmedKeywords.toString() === this.keywords.toString()) return
        if (this.playlist.keywords.toString() === trimmedKeywords.toString())
          return
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, {
          keywords: trimmedKeywords,
        })
        this.$emit('update-series', playlist)
        this.keywords = trimmedKeywords
      },
    },
    hashtag: {
      handler(newVal) {
        if (this.playlist.hashtag === newVal) return
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, { hashtag: newVal })
        this.$emit('update-series', playlist)
      },
    },
    formatGenre: {
      handler(newVal) {
        if (this.playlist.formatGenre === newVal) return
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, {
          formatGenre: newVal,
        })
        this.$emit('update-series', playlist)
      },
    },
    themeGenre: {
      handler(newVal) {
        if (this.playlist.themeGenre === newVal) return
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, { themeGenre: newVal })
        this.$emit('update-series', playlist)
      },
    },
    sameAs: {
      handler(newVal) {
        if (this.playlist.sameAs === newVal) return
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, { sameAs: newVal })
        this.$emit('update-series', playlist)
      },
    },
    citations: {
      handler(newVal) {
        if (this.playlist.citations === newVal) return
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, { citations: newVal })
        this.$emit('update-series', playlist)
      },
    },
    aliasId: {
      handler(newVal) {
        if (this.playlist.aliasId === newVal) return
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, { aliasId: newVal })
        this.$emit('update-series', playlist)
      },
    },
    layoutPattern: {
      handler(newVal) {
        if (this.playlist.layoutPattern === newVal) return
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, {
          layoutPattern: newVal,
        })
        this.$emit('update-series', playlist)
      },
    },
    publishedState: {
      handler() {
        if (this.playlist.publishedState === this.convertedPublishedState)
          return
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, {
          publishedState: this.convertedPublishedState,
        })
        this.$emit('update-series', playlist)
      },
    },
    selectedTypes: {
      handler(newValue) {
        if (
          this.playlist.outputItemListToBundle ===
            newValue.includes('itemlist') &&
          this.playlist.outputEpisodeToBundle ===
            newValue.includes('tvepisode') &&
          this.playlist.outputArticleToBundle ===
            newValue.includes('narticle') &&
          this.playlist.outputHowToToBundle === newValue.includes('howto') &&
          this.playlist.outputEventToBundle === newValue.includes('event') &&
          this.playlist.outputFaqPageToBundle === newValue.includes('faqpage')
        ) {
          return
        }

        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, {
          outputItemListToBundle: newValue.includes('itemlist'),
          outputEpisodeToBundle: newValue.includes('tvepisode'),
          outputArticleToBundle: newValue.includes('narticle'),
          outputHowToToBundle: newValue.includes('howto'),
          outputEventToBundle: newValue.includes('event'),
          outputFaqPageToBundle: newValue.includes('faqpage'),
        })
        this.$emit('update-series', playlist)
      },
    },
    selectedPalette: {
      handler(newVal) {
        this.primaryLightColor = adjustPrimaryLightColor(newVal)
        this.primaryDarkColor = adjustPrimaryDarkColor(newVal)
        this.linkLightColor = adjustLinkLightColor(newVal)
        this.linkDarkColor = adjustLinkDarkColor(newVal)

        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, {
          selectedPalette: newVal,
          primaryLightColor: this.primaryLightColor,
          primaryDarkColor: this.primaryDarkColor,
          linkLightColor: this.linkLightColor,
          linkDarkColor: this.linkDarkColor,
        })
        this.$emit('update-series', playlist)
      },
    },
    valid: {
      handler(newValue) {
        this.$emit('update-validation', newValue)
      },
    },
  },
  mounted() {
    this.fetchBundleItemCount()
  },
  methods: {
    fetchBundleItemCount() {
      console.log(this.episodeIds)

      this.$axios
        .get(`/episodes/bundle_items`, {
          params: { episode_ids: this.episodeIds },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'comma' })
          },
        })
        .then((res) => {
          const countData = res.data
          this.episodeCount = countData.tvepisode
          this.faqPageCount = countData.faqpage
          this.eventCount = countData.event
          this.howToCount = countData.howto
        })
    },
    updateSeriesImage(data: { type: string; file: string }) {
      const originalPlaylist = Object.assign({}, (this as any).playlist)

      switch (data.type) {
        case 'logo':
          this.$emit(
            'update-series',
            Object.assign(originalPlaylist, {
              logoImageData: data.file,
              removeLogoImage: false,
            })
          )
          break
        case 'eyecatch':
          this.$emit(
            'update-series',
            Object.assign(originalPlaylist, {
              eyecatchImageData: data.file,
              removeEyecatchImage: false,
            })
          )
          break
        case 'hero':
          this.$emit(
            'update-series',
            Object.assign(originalPlaylist, {
              heroImageData: data.file,
              removeHeroImage: false,
            })
          )
          break
      }
    },
    removeSeriesImage(type: string) {
      const originalPlaylist = Object.assign({}, (this as any).playlist)

      switch (type) {
        case 'logo':
          this.$emit(
            'update-series',
            Object.assign(originalPlaylist, {
              logoImageData: '',
              removeLogoImage: true,
            })
          )
          break
        case 'eyecatch':
          this.$emit(
            'update-series',
            Object.assign(originalPlaylist, {
              eyecatchImageData: '',
              removeEyecatchImage: true,
            })
          )
          break
        case 'hero':
          this.$emit(
            'update-series',
            Object.assign(originalPlaylist, {
              heroImageData: '',
              removeHeroImage: true,
            })
          )
          break
      }
    },
    validate() {
      const form: any = this.$refs.form
      form.validate()
    },
    trimKeywordHash(keywords: string[]): string[] {
      return keywords.map((keyword: string) => {
        return keyword.trim().replace('#', '')
      })
    },
  },
})
</script>

<style lang="scss">
.type-switch {
  .v-messages {
    display: none;
  }
}
</style>
