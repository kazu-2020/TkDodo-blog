<template>
  <v-card>
    <v-tabs
      v-model="tab"
      color="white"
      background-color="grey darken-3"
      show-arrows
    >
      <v-tab>基本項目</v-tab>
      <v-tab>詳細</v-tab>
      <v-tab>見た目</v-tab>
      <v-tab>タイムテーブル</v-tab>
      <v-tab>リンク(同一内容)</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <playlist-series-meta-basic-info :playlist="playlist" />
      </v-tab-item>
      <v-tab-item>
        <playlist-series-meta-detail-info :playlist="playlist" />
      </v-tab-item>
      <v-tab-item>
        <playlist-series-meta-visual :playlist="playlist" />
      </v-tab-item>
      <v-tab-item>
        <playlist-series-meta-time-table :playlist="playlist" />
      </v-tab-item>
      <v-tab-item>
        <playlist-series-meta-same-as :playlist="playlist" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import PlaylistSeriesMetaBasicInfo from '~/components/PlaylistSeriesMetaBasicInfo.vue'
import PlaylistSeriesMetaDetailInfo from '~/components/PlaylistSeriesMetaDetailInfo.vue'
import PlaylistSeriesMetaVisual from '~/components/PlaylistSeriesMetaVisual.vue'
import PlaylistSeriesMetaTimeTable from '~/components/PlaylistSeriesMetaTimeTable.vue'
import PlaylistSeriesMetaSameAs from '~/components/PlaylistSeriesMetaSameAs.vue'

export default Vue.extend({
  name: 'PlaylistSeriesMetaTabs',
  components: {
    PlaylistSeriesMetaBasicInfo,
    PlaylistSeriesMetaDetailInfo,
    PlaylistSeriesMetaVisual,
    PlaylistSeriesMetaTimeTable,
    PlaylistSeriesMetaSameAs,
  },
  props: {
    playlist: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    tab: null,
    items: [
      { tab: '基本項目', content: 'Tab 1 Content' },
      { tab: '詳細', content: 'Tab 2 Content' },
      { tab: '出演者・関係者', content: 'Tab 3 Content' },
      { tab: '見た目', content: 'Tab 4 Content' },
      { tab: 'タイムテーブル', content: 'Tab 5 Content' },
      { tab: 'リンク', content: 'Tab 6 Content' },
      { tab: '関連リンク', content: 'Tab 7 Content' },
    ],
  }),
})
</script>
