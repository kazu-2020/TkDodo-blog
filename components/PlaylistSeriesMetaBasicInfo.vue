<template>
  <v-card flat>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="playlist.nameRuby"
          :rules="playlist.nameRubyRules"
          label="ふりがな - Detailed Name Ruby"
          class="px-4"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          name="catch"
          rows="2"
          label="キャッチコピー - Detailed Catch"
          value=""
          hint="プレイリストのキャッチコピーを入力してください"
          class="px-4"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          name="catch"
          rows="3"
          label="説明 - Description"
          counter=""
          value=""
          hint="プレイリストの説明を入力してください"
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
})
</script>
