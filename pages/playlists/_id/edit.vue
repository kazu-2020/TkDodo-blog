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
              :rules="detailedNameRubyRules"
              label="ふりがな - Detailed Name Ruby"
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
        </v-row>

        <v-row dense class="my-5">
          <v-col cols="12">
            <h3>画像</h3>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <playlist-thumbnail />
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
          <v-col cols="12">
            <v-row v-for="sameAs in playlist.sameAs" :key="sameAs.id">
              <v-col cols="5">
                <v-text-field
                  v-model="sameAs.name"
                  :rules="nameRules"
                  label="名前"
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="sameAs.url"
                  :rules="nameRules"
                  label="URL"
                />
              </v-col>
              <v-col cols="1">
                <v-btn color="error" class="mr-4" @click="removeSameAs(sameAs)">
                  削除
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
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
import PlaylistThumbnail from '~/components/PlaylistThumbnail.vue'

interface SameAs {
  name: string
  url: string
}

export default Vue.extend({
  name: 'PlaylistIdEditComponent',
  components: {
    PlaylistThumbnail,
  },
  async asyncData({ store, params }) {
    if (store.getters['playlists/editingPlaylist']) {
      return
    }
    await store.dispatch('playlists/fetchPlaylist', params.id)
  },
  data: () => ({
    valid: true,
    nameRules: [
      (v: String) => !!v || 'Name is required',
      (v: String) =>
        (v && v.length <= 255) || 'Name must be less than 255 characters',
    ],
    detailedNameRubyRules: [
      (v: String) =>
        (v && v.length <= 255) || 'NameRuby must be less than 255 characters',
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
    playlist: {
      id: null,
      publish_state: 0,
      formatGenre: null,
      themeGenre: null,
      detailedCatch: null,
      sameAs: [], // { name, url }
      hashtags: [], // { name: '' }
      keywords: [],
      roles: [],
      colors: null, // TODO
      // 公開系
      publishedStartDate: null,
      publishedEndDate: null,
      isPublish: false,
    },
    color: '#FFFFFF',
    mask: '!#XXXXXXXX',
    menu: false,
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
  },
  methods: {
    addSameAs() {
      const sameAsList: Array<SameAs> = this.playlist.sameAs
      sameAsList.push({
        name: '',
        url: '',
      })
    },
    removeSameAs(sameAs: SameAs) {
      const sameAsList: Array<SameAs> = this.playlist.sameAs
      sameAsList.splice(sameAsList.indexOf(sameAs), 1)
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
