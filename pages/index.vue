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
import Vue from 'vue'
import PlaylistItem from '~/components/PlaylistItem.vue'

export default Vue.extend({
  name: 'PlaylistIndexComponent',
  components: { PlaylistItem },
  async asyncData({ store }) {
    await store.dispatch('playlists/fetchPlaylists')
  },
  computed: {
    playlists() {
      return this.$store.state.playlists.allItems
    },
  },
})
</script>
