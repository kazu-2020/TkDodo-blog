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
      <v-tab>出演者・関係者</v-tab>
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
        <playlist-series-meta-act-list :act-list="playlist.actList" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import PlaylistSeriesMetaBasicInfo from '~/components/PlaylistSeriesMetaBasicInfo.vue'
import PlaylistSeriesMetaDetailInfo from '~/components/PlaylistSeriesMetaDetailInfo.vue'
import PlaylistSeriesMetaVisual from '~/components/PlaylistSeriesMetaVisual.vue'
import PlaylistSeriesMetaActList from '~/components/PlaylistSeriesMetaActList.vue'

export default Vue.extend({
  name: 'PlaylistSeriesMetaTabs',
  components: {
    PlaylistSeriesMetaBasicInfo,
    PlaylistSeriesMetaDetailInfo,
    PlaylistSeriesMetaVisual,
    PlaylistSeriesMetaActList,
  },
  props: {
    playlist: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    tab: null,
  }),
})
</script>
