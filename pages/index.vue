<template>
  <v-layout column>
    <v-row>
      <v-col>
        <div class="title mb-4">
          プレイリスト一覧
        </div>
      </v-col>
    </v-row>
    <v-flex xs12 sm8 md6>
      <playlist-item
        v-for="item in playlists"
        :key="item.id"
        :playlist="item"
      />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    PlaylistItem: () => import('~/components/PlaylistItem.vue'),
  },
  async asyncData({ store }) {
    if (store.getters['playlists/allItems'].length) {
      return
    }
    await store.dispatch('playlists/fetchPlaylists')
  },
})
export default class IndexComponent extends Vue {
  get playlists() {
    return this.$store.state.playlists.allItems
  }
}
</script>
