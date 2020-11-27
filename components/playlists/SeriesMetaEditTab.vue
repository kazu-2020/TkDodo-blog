<template>
  <div>
    <h2>基本情報</h2>
    <v-row>
      <v-col cols="12">
        <v-form ref="form" v-model="valid" class="ml-5">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="editingPlaylist.name"
                :rules="nameRules"
                label="名前 - Name"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="editingPlaylist.detailedNameRuby"
                label="ふりがな - Detailed Name Ruby"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="editingPlaylist.detailedCatch"
                name="catch"
                rows="3"
                label="キャッチコピー - Detailed Catch"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="editingPlaylist.description"
                name="catch"
                rows="5"
                label="説明 - Description"
                counter
              />
            </v-col>

            <v-col cols="12">
              <v-combobox
                v-model="editingPlaylist.keywords"
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
                v-model="editingPlaylist.hashtag"
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
                  v-model="editingPlaylist.formatGenre"
                  :items="formatGenreList"
                  label="ジャンル(フォーマット) - Format Genre"
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-select
                  v-model="editingPlaylist.themeGenre"
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
                v-model="editingPlaylist.aliasId"
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
import Vue, { PropType } from 'vue'

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
      type: Object as PropType<Playlist>,
      required: true,
      default: () => {},
    },
  },
  data(): DataType {
    const editingPlaylist = {} as Playlist
    return {
      editingPlaylist: this.playlist || editingPlaylist,
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
    editingPlaylist: {
      handler() {
        ;(this as any).showUnloadAlert()
      },
      deep: true,
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
