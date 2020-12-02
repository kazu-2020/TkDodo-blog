<template>
  <div>
    <h2>基本情報</h2>
    <v-row>
      <v-col cols="12">
        <v-form ref="form" v-model="valid" class="ml-5">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="名前 - Name"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="detailedNameRuby"
                label="ふりがな - Detailed Name Ruby"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="detailedCatch"
                name="catch"
                rows="3"
                label="キャッチコピー - Detailed Catch"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="description"
                name="catch"
                rows="5"
                label="説明 - Description"
                counter
              />
            </v-col>

            <v-col cols="12">
              <v-combobox
                v-model="keywords"
                :items="[]"
                hide-selected
                label="キーワード - Keywords"
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
                      >mdi-close</v-icon
                    >
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
                      >mdi-close</v-icon
                    >
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>
            <v-row flex-start>
              <v-col cols="6" md="3">
                <v-select
                  v-model="formatGenre"
                  :items="formatGenreList"
                  label="ジャンル(フォーマット) - Format Genre"
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-select
                  v-model="themeGenre"
                  :items="themeGenreList"
                  label="ジャンル(テーマ) - Theme Genre"
                />
              </v-col>
            </v-row>
          </v-row>

          <v-row dense class="my-5">
            <v-col cols="12">
              <h3>画像</h3>
            </v-col>
            <series-images-form
              :playlist="editingPlaylist"
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
            <same-as-form :same-as.sync="editingPlaylist.sameAs" />
          </v-row>
          <!-- citations -->
          <v-row dense class="my-5">
            <v-col cols="12">
              <h3>
                関連リンク<small class="text--secondary"> - Citation</small>
              </h3>
            </v-col>
            <citations-form :citations.sync="editingPlaylist.citations" />
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
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { Playlist } from '@/types/playlist'
import {
  adjustPrimaryDarkColor,
  adjustPrimaryLightColor,
  adjustLinkDarkColor,
  adjustLinkLightColor,
} from '@/utils/adjustColor'
import unloadAlertMixin from '~/components/common/unloadAlertMixin.ts'
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
  aliasId: string
  editingPlaylist: Playlist
  valid: boolean
  nameRules: Function[]
  aliasIdRules: Function[]
  formatGenreList: Object[]
  themeGenreList: Object[]
}

export default Vue.extend({
  name: 'SeriesMetaEditTab',
  components: {
    ColorPalette,
    CitationsForm,
    SeriesImagesForm,
    SameAsForm,
  },
  mixins: [unloadAlertMixin],
  props: {
    playlist: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data(): DataType {
    const editingPlaylist = {} as Playlist
    return {
      editingPlaylist: this.playlist || editingPlaylist,
      name: this.playlist.name || '',
      detailedNameRuby: this.playlist.detailedNameRuby || '',
      detailedCatch: this.playlist.detailedCatch || '',
      description: this.playlist.description || '',
      keywords: this.playlist.keywords || [],
      hashtag: this.playlist.hashtag || [],
      formatGenre: this.playlist.formatGenre || '',
      themeGenre: this.playlist.themeGenre || '',
      aliasId: this.playlist.aliasId || '',
      valid: true,
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
    }
  },
  computed: {
    selectedPalette: {
      get() {
        return (this as any).editingPlaylist.selectedPalette
      },
      set(value: string) {
        const playlist = this.editingPlaylist

        playlist.selectedPalette = value
        playlist.primaryLightColor = adjustPrimaryLightColor(value)
        playlist.primaryDarkColor = adjustPrimaryDarkColor(value)
        playlist.linkLightColor = adjustLinkLightColor(value)
        playlist.linkDarkColor = adjustLinkDarkColor(value)
      },
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
        this.aliasId = newVal.aliasId
      },
      deep: true,
    },
    name: {
      handler(newVal) {
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, { name: newVal })
        this.$emit('update-series', playlist)
      },
    },
    detailedNameRuby: {
      handler(newVal) {
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, {
          detailedNameRuby: newVal,
        })
        this.$emit('update-series', playlist)
      },
    },
    detailedCatch: {
      handler(newVal) {
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, {
          detailedCatch: newVal,
        })
        this.$emit('update-series', playlist)
      },
    },
    description: {
      handler(newVal) {
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, {
          description: newVal,
        })
        this.$emit('update-series', playlist)
      },
    },
    keywords: {
      handler(newVal) {
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, { keywords: newVal })
        this.$emit('update-series', playlist)
      },
    },
    hashtag: {
      handler(newVal) {
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, { hashtag: newVal })
        this.$emit('update-series', playlist)
      },
    },
    formatGenre: {
      handler(newVal) {
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, {
          formatGenre: newVal,
        })
        this.$emit('update-series', playlist)
      },
    },
    themeGenre: {
      handler(newVal) {
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, { themeGenre: newVal })
        this.$emit('update-series', playlist)
      },
    },
    aliasId: {
      handler(newVal) {
        const originalPlaylist = Object.assign({}, (this as any).playlist)
        const playlist = Object.assign(originalPlaylist, { aliasId: newVal })
        this.$emit('update-series', playlist)
      },
    },
  },
  methods: {
    updateSeriesImage(data: { type: string; file: string }) {
      switch (data.type) {
        case 'logo':
          this.editingPlaylist.logoImageData = data.file
          this.editingPlaylist.removeLogoImage = false
          break
        case 'eyecatch':
          this.editingPlaylist.eyecatchImageData = data.file
          this.editingPlaylist.removeEyecatchImage = false
          break
        case 'hero':
          this.editingPlaylist.heroImageData = data.file
          this.editingPlaylist.removeHeroImage = false
          break
      }
    },
    removeSeriesImage(type: string) {
      switch (type) {
        case 'logo':
          this.editingPlaylist.logoImageData = ''
          this.editingPlaylist.removeLogoImage = true
          break
        case 'eyecatch':
          this.editingPlaylist.eyecatchImageData = ''
          this.editingPlaylist.removeEyecatchImage = true
          break
        case 'hero':
          this.editingPlaylist.heroImageData = ''
          this.editingPlaylist.removeHeroImage = true
          break
      }
    },
    validate() {
      const form: any = this.$refs.form
      form.validate()
    },
  },
})
</script>
