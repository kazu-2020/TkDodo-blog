<template>
  <v-card flat>
    <v-row justify="center" align="center">
      <v-col cols="6">
        <v-select
          :items="formatGenres"
          label="ジャンル(フォーマット) - Format Genre"
          class="pl-4 pr-2"
        />
      </v-col>
      <v-col cols="6">
        <v-select
          :items="themeGenres"
          label="ジャンル(テーマ) - Theme Genre"
          class="pl-2 pr-4"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field label="キーワード - Keywords" class="px-4" />
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="ハッシュタグ - Hashtag"
          hint="タグの先頭に「#」をつけてください。スペース区切りで複数のタグが登録可能です。"
          class="px-4"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'PlaylistSeriesMetaDetailInfo',
  props: {
    playlist: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    validationRules: {
      nameRules: [
        (v: String) => !!v || 'Name is required',
        (v: String) =>
          (v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
      nameRubyRules: [
        (v: String) =>
          (v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
    },
    formatGenres: [
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
    themeGenres: [
      { value: '020', text: 'スポーツ全般' },
      { value: '070', text: '音楽全般' },
      { value: '092', text: '自然' },
      { value: '093', text: '科学' },
      { value: '096', text: '芸術' },
      { value: '110', text: '福祉全般' },
    ],
  }),
})
</script>
