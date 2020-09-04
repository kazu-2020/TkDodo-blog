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
            <v-text-field
              v-model="editingPlaylist.keywords"
              label="キーワード - Keywords"
              hint="カンマ（,)区切りで複数のキーワードが登録可能です。"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="editingPlaylist.hashtag"
              label="ハッシュタグ - Hashtag"
              hint="タグの先頭に「#」をつけてください。スペース区切りで複数のタグが登録可能です。"
            />
          </v-col>
          <v-row flex-start>
            <v-col cols="6" md="3">
              <v-select
                v-model="editingPlaylist.themeGenre"
                :items="formatGenreLists"
                label="ジャンル(フォーマット) - Format Genre"
              />
            </v-col>
            <v-col cols="6" md="3">
              <v-select
                v-model="editingPlaylist.themeGenre"
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
          <same-as-form :same-as.sync="editingPlaylist.sameAs" />
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
import { Playlist } from '@/types/playlist'
import {
  adjustPrimaryDarkColor,
  adjustPrimaryLightColor,
  adjustLinkDarkColor,
  adjustLinkLightColor,
} from '@/utils/adjustColor'
import ColorPalette from '~/components/forms/ColorPalette.vue'
import SeriesImagesForm from '~/components/forms/SeriesImagesForm.vue'
import SameAsForm from '~/components/forms/SameAsForm.vue'

const editingPlaylist = {} as Playlist

export default Vue.extend({
  name: 'PlaylistIdEditPage',
  components: {
    ColorPalette,
    SeriesImagesForm,
    SameAsForm,
  },
  asyncData({ $axios, params }) {
    return $axios.get(`/api/playlists/${params.id}`).then((res) => {
      return {
        editingPlaylist: res.data.playlist,
      }
    })
  },
  data: () => ({
    editingPlaylist,
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
    selectedPalette: {
      get() {
        return this.editingPlaylist.selectedPalette
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
  methods: {
    updateSeriesImage(data: any) {
      console.log('updateSeriesImage')
      switch (data.type) {
        case 'logo':
          this.editingPlaylist.logoImageData = data.file
          this.editingPlaylist.removeLogoImage = data.file == null
          break
        case 'eyecatch':
          this.editingPlaylist.eyecatchImageData = data.file
          this.editingPlaylist.removeEyecatchImage = data.file == null
          break
        case 'hero':
          this.editingPlaylist.heroImageData = data.file
          this.editingPlaylist.removeHeroImage = data.file == null
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
        const playlist = this.editingPlaylist
        const body: { [key: string]: string } = {
          name: playlist.name,
          detailed_name_ruby: playlist.detailedNameRuby,
          description: playlist.description,
          keywords: playlist.keywords,
          detailed_catch: playlist.detailedCatch,
          hashtag: playlist.hashtag,
          format_genre_code: playlist.formatGenre,
          theme_genre_code: playlist.themeGenre,
          selected_palette: playlist.selectedPalette,
          primary_light_color: playlist.primaryLightColor,
          primary_dark_color: playlist.primaryDarkColor,
          text_light_color: playlist.textLightColor,
          text_dark_color: playlist.textDarkColor,
          link_light_color: playlist.linkLightColor,
          link_dark_color: playlist.linkDarkColor,
          reserve_publish_time_at: playlist.reservePublishTimeAt,
          reserve_finish_time_at: playlist.reserveFinishTimeAt,
          alias_id: playlist.aliasId,
          remove_logo_image: playlist.removeLogoImage?.toString(),
          remove_eyecatch_image: playlist.removeEyecatchImage?.toString(),
          remove_hero_image: playlist.removeHeroImage?.toString(),
        }

        if (playlist.logoImageData) {
          Object.assign(body, {
            logo_image: playlist.logoImageData,
          })
        }
        if (playlist.eyecatchImageData) {
          Object.assign(body, {
            eyecatch_image: playlist.eyecatchImageData,
          })
        }
        if (playlist.heroImageData) {
          Object.assign(body, {
            hero_image: playlist.heroImageData,
          })
        }
        const data = new FormData()
        for (const key in body) {
          if (body[key] != null) {
            data.append(`playlist[${key}]`, body[key])
          }
        }

        if (playlist.sameAs?.id) {
          data.append(
            'playlist[same_as_attributes][id]',
            playlist.sameAs.id.toString()
          )
        }
        if (playlist.sameAs?.name) {
          data.append(
            'playlist[same_as_attributes][name]',
            playlist.sameAs?.name
          )
        }
        if (playlist.sameAs?.url) {
          data.append('playlist[same_as_attributes][url]', playlist.sameAs.url)
        }
        if (playlist.sameAs?._destroy) {
          data.append(
            'playlist[same_as_attributes][_destroy]',
            playlist.sameAs._destroy.toString()
          )
        }

        this.$axios
          .put(`/api/playlists/${playlist.id}`, data)
          .then((_response) => {
            this.$store.dispatch('loading/succeedLoading')
          })
          .catch((_error) => {
            this.$store.dispatch('loading/failLoading')
          })
      } else {
        console.log('Invalid!!!')
      }
    },
  },
})
</script>
