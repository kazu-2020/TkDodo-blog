<template>
  <v-card>
    <v-tabs
      v-model="tab"
      color="white"
      background-color="grey darken-3"
      show-arrows
    >
      <v-tab v-for="item in items" :key="item.tab">
        {{ item.tab }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item.tab">
        <v-card flat>
          <v-card-text>{{ item.content }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PlaylistSeriesMetaTabs extends Vue {
  tab = null
  items = [
    { tab: '基本項目', content: 'Tab 1 Content' },
    { tab: '詳細', content: 'Tab 2 Content' },
    { tab: '出演者・関係者', content: 'Tab 3 Content' },
    { tab: '見た目', content: 'Tab 4 Content' },
    { tab: 'タイムテーブル', content: 'Tab 5 Content' },
    { tab: 'リンク', content: 'Tab 6 Content' },
    { tab: '関連リンク', content: 'Tab 7 Content' },
  ]
}
</script>
