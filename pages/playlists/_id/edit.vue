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
          <v-col cols="2">
            <v-card tile>
              <v-card-title>
                ロゴ
              </v-card-title>
              <v-img
                :src="logoImageUrl"
                aspect-ratio="1"
                @click="selectLogoImageFile"
              />
              <input
                id="logoImageFile"
                ref="logoImageInput"
                type="file"
                accept="image/*"
                style="display: none;"
                @change="replaceLogoImage"
              />
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card tile>
              <v-card-title>
                アイキャッチ
              </v-card-title>
              <v-img
                :src="eyecatchImageUrl"
                aspect-ratio="1.777777778"
                @click="selectEyecatchImageFile"
              />
              <input
                id="eyecatchImageFile"
                ref="eyecatchImageInput"
                type="file"
                accept="image/*"
                style="display: none;"
                @change="replaceEyecatchImage"
              />
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card tile>
              <v-card-title>
                ヒーローイメージ
              </v-card-title>
              <v-img
                :src="heroImageUrl"
                aspect-ratio="3"
                @click="selectHeroImageFile"
              />
              <input
                id="heroImageFile"
                ref="heroImageInput"
                type="file"
                accept="image/*"
                style="display: none;"
                @change="replaceHeroImage"
              />
            </v-card>
          </v-col>
        </v-row>

        <!-- 色 -->
        <v-row dense class="my-5">
          <v-col cols="12">
            <h3>色 - Color</h3>
            <p>
              ここで選んだ色がアクセシビリティに配慮された色に変換されページに反映されます
            </p>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="12" class="d-flex flex-row">
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#faf100"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#f6aa00"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#ff2800"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#990099"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#005aff"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#03af7a"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#ff8082"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#4dc4ff"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#804000"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#84919e"
                  class="mr-4"
                />
                <v-sheet width="40" height="40" elevation="4" color="white" />
              </v-col>
            </v-row>
            <v-row justify="start" align="center">
              <v-col class="shrink" style="min-width: 220px;">
                <v-text-field
                  v-model="color"
                  v-mask="mask"
                  hide-details
                  class="ma-0 pa-0"
                  solo
                >
                  <template v-slot:append>
                    <v-menu
                      v-model="menu"
                      top
                      nudge-bottom="105"
                      nudge-left="16"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <div :style="swatchStyle" v-on="on" />
                      </template>
                      <v-card>
                        <v-card-text class="pa-0">
                          <v-color-picker v-model="color" flat />
                        </v-card-text>
                      </v-card>
                    </v-menu>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>
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

interface SameAs {
  name: string
  url: string
}

export default Vue.extend({
  name: 'PlaylistIdEditComponent',
  async asyncData({ store, params }) {
    if (store.getters['playlists/editingPlaylist']) {
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
    color: '#FFFFFF',
    mask: '!#XXXXXXXX',
    menu: false,
    logoImageData: '',
    eyecatchImageData: '',
    heroImageData: '',
  }),
  computed: {
    swatchStyle() {
      const { color, menu } = this
      return {
        backgroundColor: color,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        borderRadius: menu ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out',
      }
    },
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
    logoImageUrl(): string {
      return (
        this.logoImageData ||
        this.editingPlaylist.logo?.medium?.url ||
        'https://placehold.jp/640x640.png'
      )
    },
    eyecatchImageUrl(): string {
      return (
        this.eyecatchImageData ||
        this.editingPlaylist.eyecatch?.medium?.url ||
        'https://placehold.jp/640x360.png'
      )
    },
    heroImageUrl(): string {
      return (
        this.heroImageData ||
        this.editingPlaylist.hero?.medium?.url ||
        'https://placehold.jp/1080x360.png'
      )
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
    selectLogoImageFile() {
      ;(this.$refs.logoImageInput as HTMLElement).click()
    },
    replaceLogoImage() {
      const inputElement = this.$refs.logoImageInput as HTMLInputElement
      this.replaceImage(inputElement, 'logo')
    },
    selectEyecatchImageFile() {
      ;(this.$refs.eyecatchImageInput as HTMLElement).click()
    },
    replaceEyecatchImage() {
      const inputElement = this.$refs.eyecatchImageInput as HTMLInputElement
      this.replaceImage(inputElement, 'eyecatch')
    },
    selectHeroImageFile() {
      ;(this.$refs.heroImageInput as HTMLElement).click()
    },
    replaceHeroImage() {
      const inputElement = this.$refs.heroImageInput as HTMLInputElement
      this.replaceImage(inputElement, 'hero')
    },
    replaceImage(targetElement: HTMLInputElement, type: string) {
      if (targetElement.files === null) {
        return
      }
      const file = targetElement.files[0]

      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target !== null) {
            switch (type) {
              case 'logo':
                this.logoImageData = e.target.result as string
                this.$store.dispatch(
                  'playlists/updateEditingPlaylistLogo',
                  file
                )
                break
              case 'eyecatch':
                this.eyecatchImageData = e.target.result as string
                this.$store.dispatch(
                  'playlists/updateEditingPlaylistEyecatch',
                  file
                )
                break
              case 'hero':
                this.heroImageData = e.target.result as string
                this.$store.dispatch(
                  'playlists/updateEditingPlaylistHero',
                  file
                )
                break
            }
          }
        }
        reader.readAsDataURL(file)
      }
    },
  },
})
</script>
