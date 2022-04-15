<template>
  <v-simple-table>
    <template #default>
      <thead>
        <tr>
          <th style="width: 10%" />
          <th style="width: 10%" />
          <th class="text-left">シリーズ名</th>
          <th class="text-left">アイテム数</th>
        </tr>
      </thead>
      <draggable v-model="playlists" tag="tbody">
        <tr
          v-for="playlist in playlists"
          :key="`series-playlist-${playlist.seriesId}`"
          style="cursor: pointer"
        >
          <td>
            <v-btn
              tile
              small
              color="orange"
              class="delete-button"
              @click.stop="deletePlaylist(playlist)"
            >
              <v-icon> mdi-minus </v-icon>
            </v-btn>
          </td>
          <td justify="center" align="center">
            <v-img
              :src="logoUrl(playlist)"
              lazy-src="https://placehold.jp/40x40.png"
              width="40"
              height="40"
              class="ma-2 playlist-image"
            />
          </td>
          <td align="left">
            {{ playlist.name }}
          </td>
          <td>
            TVEpisode: {{ countWrapper(playlist.itemNum) }} HowTo:
            {{ countWrapper(playlist.howToCount) }}
            <br />
            Event: {{ countWrapper(playlist.eventCount) }} FaqPage:
            {{ countWrapper(playlist.faqPageCount) }}
          </td>
        </tr>
      </draggable>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from 'vue'
import draggable from 'vuedraggable'

export default Vue.extend({
  name: 'SeriesDeckPlaylist',
  components: {
    draggable,
  },
  props: {
    deck: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  computed: {
    playlists: {
      get(): any[] {
        return this.deck.playlists
      },
      set(value: any) {
        this.$emit('update-playlists', value)
      },
    },
  },
  methods: {
    deletePlaylist(playlist: any) {
      this.$emit('delete-playlist', playlist)
    },
    logoUrl(playlist: any) {
      if (playlist?.logo !== undefined) {
        return playlist.logo.medium.url
      } else if ((playlist?.keyvisuals || [])[0] !== undefined) {
        return playlist.keyvisuals[0].small.url
      } else if (playlist?.partOfSeries?.logo !== undefined) {
        return playlist.partOfSeries.logo.medium.url
      }

      return 'https://placehold.jp/40x40.png'
    },
    countWrapper(count: number | undefined): number | string {
      return count === undefined ? '-' : count
    },
  },
})
</script>

<style lang="scss" scoped>
.delete-button.v-btn.v-btn--tile.v-size--small {
  min-width: 0;
  padding: 0 2px;
}
</style>
