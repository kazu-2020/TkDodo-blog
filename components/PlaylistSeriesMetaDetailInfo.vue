<template>
  <v-card flat>
    <v-row justify="center" align="center">
      <v-col cols="12">
        <v-text-field
          v-model="playlist.name"
          :rules="playlist.nameRules"
          label="名前 - Name"
          required
          class="px-4"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="playlist.nameRuby"
          :rules="playlist.nameRubyRules"
          label="ふりがな - Detailed Name Ruby"
          class="px-4"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="playlist.keywords"
          label="キーワード - Keywords"
          class="px-4"
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="playlist.hashtags"
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
  }),
})
</script>
