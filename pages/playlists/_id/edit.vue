<template>
  <v-row>
    <v-col cols="12">
      <nuxt-link :to="`/playlists/${editingPlaylist.id}`">
        ≪ プレイリスト詳細に戻る
      </nuxt-link>
    </v-col>
    <v-col cols="12">
      <div class="title mb-4">
        <h2>メタ情報の編集</h2>
      </div>
      <v-form ref="form" v-model="valid" class="ml-5">
        <v-row dense>
          <v-col cols="12">
            <h3>基本項目</h3>
          </v-col>
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
            <v-text-field
              v-model="keywords"
              label="キーワード - Keywords"
              hint="カンマ（,)区切りで複数のキーワードが登録可能です。"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="hashtag"
              label="ハッシュタグ - Hashtag"
              hint="タグの先頭に「#」をつけてください。スペース区切りで複数のタグが登録可能です。"
            />
          </v-col>
          <v-row flex-start>
            <v-col cols="6" md="3">
              <v-select
                v-model="formatGenre"
                :items="formatGenreLists"
                label="ジャンル(フォーマット) - Format Genre"
              />
            </v-col>
            <v-col cols="6" md="3">
              <v-select
                v-model="themeGenre"
                :items="themeGenreLists"
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
          <v-col v-if="!noSameAs()" cols="12">
            <v-row>
              <v-col cols="5">
                <v-text-field
                  v-model="sameAsName"
                  :rules="nameRules"
                  label="名前"
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="sameAsUrl"
                  :rules="nameRules"
                  label="URL"
                />
              </v-col>
              <v-col cols="1">
                <v-btn color="error" class="mr-4" @click="removeSameAs">
                  削除
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="noSameAs()" cols="12">
            <v-btn class="mr-4" @click="addSameAs">
              <v-icon>mdi-plus</v-icon>
              リンク(同一内容)を追加
            </v-btn>
          </v-col>
        </v-row>

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="submitEditingPlaylist"
        >
          保存する
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import ColorPalette from '~/components/forms/ColorPalette.vue'
import SeriesImagesForm from '~/components/forms/SeriesImagesForm.vue'
import {
  adjustPrimaryDarkColor,
  adjustPrimaryLightColor,
  adjustLinkDarkColor,
  adjustLinkLightColor,
} from '@/utils/adjustColor'

interface SameAs {
  name: string
  url: string
}

export default Vue.extend({
  name: 'PlaylistIdEditComponent',
  components: {
    ColorPalette,
    SeriesImagesForm,
  },
  async asyncData({ store, params }) {
    if ((store as any).$accessor.playlists.editingPlaylist.id) {
      return
    }
    await store.dispatch('playlists/fetchPlaylist', params.id)
  },
  data: () => ({
    valid: true,
    nameRules: [
      (v: String) => !!v || '名前は必ず入力してください',
      (v: String) =>
        (v && v.length <= 255) || '名前は255文字以下で入力してください',
    ],
    formatGenreLists: [
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
    themeGenreLists: [
      { value: '020', text: 'スポーツ全般' },
      { value: '070', text: '音楽全般' },
      { value: '092', text: '自然' },
      { value: '093', text: '科学' },
      { value: '096', text: '芸術' },
      { value: '110', text: '福祉全般' },
    ],
  }),
  computed: {
    editingPlaylist() {
      return this.$store.state.playlists.editingPlaylist
    },
    name: {
      get() {
        return this.$store.state.playlists.editingPlaylist.name
      },
      set(value) {
        this.$store.dispatch('playlists/updateEditingPlaylistName', value)
      },
    },
    detailedNameRuby: {
      get() {
        return this.$store.state.playlists.editingPlaylist.detailedNameRuby
      },
      set(value) {
        this.$store.dispatch(
          'playlists/updateEditingPlaylistDetailedNameRuby',
          value
        )
      },
    },
    formatGenre: {
      get() {
        return this.$store.state.playlists.editingPlaylist.formatGenre
      },
      set(value) {
        this.$store.dispatch(
          'playlists/updateEditingPlaylistFormatGenre',
          value
        )
      },
    },
    themeGenre: {
      get() {
        return this.$store.state.playlists.editingPlaylist.themeGenre
      },
      set(value) {
        this.$store.dispatch('playlists/updateEditingPlaylistThemeGenre', value)
      },
    },
    detailedCatch: {
      get() {
        return this.$store.state.playlists.editingPlaylist.detailedCatch
      },
      set(value) {
        this.$store.dispatch(
          'playlists/updateEditingPlaylistDetailedCatch',
          value
        )
      },
    },
    description: {
      get() {
        return this.$store.state.playlists.editingPlaylist.description
      },
      set(value) {
        this.$store.dispatch(
          'playlists/updateEditingPlaylistDescription',
          value
        )
      },
    },
    keywords: {
      get() {
        return this.$store.state.playlists.editingPlaylist.keywords
      },
      set(value) {
        this.$store.dispatch('playlists/updateEditingPlaylistKeywords', value)
      },
    },
    hashtag: {
      get() {
        return this.$store.state.playlists.editingPlaylist.hashtag
      },
      set(value) {
        this.$store.dispatch('playlists/updateEditingPlaylistHashtag', value)
      },
    },
    sameAs: {
      get() {
        return this.$store.state.sameAs
      },
    },
    sameAsName: {
      get() {
        return this.$store.state.sameAs.name
      },
      set(value) {
        this.$store.dispatch('sameAs/updateName', value)
      },
    },
    sameAsUrl: {
      get() {
        return this.$store.state.sameAs.url
      },
      set(value) {
        this.$store.dispatch('sameAs/updateUrl', value)
      },
    },
    selectedPalette: {
      get() {
        return this.$store.state.playlists.editingPlaylist.selectedPalette
      },
      set(value: string) {
        this.$store.dispatch(
          'playlists/updateEditingPlaylistSelectedPalette',
          value
        )
        this.$store.dispatch(
          'playlists/updateEditingPlaylistPrimaryLightColor',
          adjustPrimaryLightColor(value)
        )
        this.$store.dispatch(
          'playlists/updateEditingPlaylistPrimaryDarkColor',
          adjustPrimaryDarkColor(value)
        )
        this.$store.dispatch(
          'playlists/updateEditingPlaylistLinkLightColor',
          adjustLinkLightColor(value)
        )
        this.$store.dispatch(
          'playlists/updateEditingPlaylistLinkDarkColor',
          adjustLinkDarkColor(value)
        )
      },
    },
  },
  methods: {
    addSameAs() {
      this.sameAsName = ''
      this.sameAsUrl = ''
    },
    removeSameAs() {
      this.$store.dispatch('sameAs/delete')
    },
    noSameAs() {
      return (
        (this.sameAs.id === null &&
          this.sameAs.name === null &&
          this.sameAs.url === null) ||
        this.sameAs._destroy === 1
      )
    },
    updateSeriesImage(data: any) {
      switch (data.type) {
        case 'logo':
          this.$store.dispatch('playlists/updateEditingPlaylistLogo', data.file)
          break
        case 'eyecatch':
          this.$store.dispatch(
            'playlists/updateEditingPlaylistEyecatch',
            data.file
          )
          break
        case 'hero':
          this.$store.dispatch('playlists/updateEditingPlaylistHero', data.file)
          break
      }
    },
    validate() {
      const form: any = this.$refs.form
      form.validate()
    },
    submitEditingPlaylist() {
      const form: any = this.$refs.form
      form.validate()

      if (this.valid) {
        this.$store.dispatch('loading/startLoading', {
          success: '保存しました',
          error: '保存失敗しました',
        })
        this.$store.dispatch('playlists/updateEditingPlaylist')
      } else {
        console.log('Invalid!!!')
      }
    },
  },
})
</script>
