<template>
  <v-card flat>
    <v-row justify="center" align="center">
      <v-col cols="3" align="right" class="pr-2">
        プレイリストの公開
      </v-col>
      <v-col cols="9">
        <v-radio-group :mandatory="true" row>
          <v-radio label="非公開" value="0" checked="true" />
          <v-radio label="公開" value="1" />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="3" align="right" class="pr-2">
        ID
      </v-col>
      <v-col cols="9" class="pl-2">
        {{ playlist.id }}
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-select
          v-model="playlist.formatGenre"
          :items="formatGenres"
          label="ジャンル(フォーマット) - Format Genre"
          class="pl-4 pr-2"
        />
      </v-col>
      <v-col cols="6">
        <v-select
          v-model="playlist.themeGenre"
          :items="themeGenres"
          label="ジャンル(テーマ) - Theme Genre"
          class="pl-2 pr-4"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          name="catch"
          rows="3"
          label="キャッチコピー - Detailed Catch"
          value=""
          hint="プレイリストのキャッチコピーを入力してください"
          class="px-4"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'PlaylistSeriesMetaBasicInfo',
  props: {
    playlist: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
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
