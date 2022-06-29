<template>
  <div>
    <v-simple-table>
      <template #default>
        <thead>
          <tr>
            <th class="pr-0" width="83" />
            <th class="text-left pr-0 pl-0" width="300">プレイリスト</th>
            <th class="text-left pr-0 pl-0" width="275">記事の有無</th>
            <th class="text-left pr-0 pl-0">視聴可能エピソード数</th>
          </tr>
        </thead>
      </template>
    </v-simple-table>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="playlist in playlists"
        :key="playlist.playlistUId"
      >
        <v-expansion-panel-header>
          <template #actions>
            <v-icon color="#3498db"> mdi-menu-down </v-icon>
          </template>
          <td class="delete-button pr-5">
            <v-btn
              tile
              color="orange"
              class="delete_button"
              height="21px"
              width="21px"
              min-width="21px"
              @click="deletePlaylist(playlist)"
            >
              <v-icon> mdi-minus </v-icon>
            </v-btn>
          </td>
          <td class="playlist-image">
            <v-img
              :src="logoUrl(playlist)"
              lazy-src="https://placehold.jp/40x40.png"
              width="30"
              height="30"
              class="ma-2 playlist-image"
            />
          </td>
          <td class="playlist-name pl-5">
            {{ playlist.name }}
          </td>
          <td class="playlist-status">{{ articleStatus(playlist) }}</td>
          <td class="playlist-can-be-watch">
            <v-chip
              v-if="playlist.playableItemsCount > 0"
              class="mx-2"
              color="pink"
              label
              text-color="white"
              >{{ playlist.playableItemsCount }}/{{ playlist.itemNum }}</v-chip
            >
            <v-chip v-else class="mx-2" color="grey" label text-color="white"
              >0/{{ playlist.itemNum }}</v-chip
            >
          </td>
          <span color="blue" class="display-episode">エピソード表示</span>
        </v-expansion-panel-header>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
  headers: object
}

export default Vue.extend({
  name: 'DeckPlaylist',
  props: {
    deck: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      headers: [
        {
          value: 'name',
          text: 'プレイリスト',
          sortable: false,
        },
        { value: 'articleStatus', text: '記事の有無', sortable: false },
        { value: 'videoStatus', text: '視聴可能エピソード数', sortable: false },
      ],
    }
  },
  computed: {
    playlists: {
      get(): any[] {
        console.log(this.deck.playlists)
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
    hasVideo(playlist: any) {
      return playlist.playableItemsCount !== 0
    },
    hasArticle(playlist: any) {
      return playlist.article.markedBody !== null
    },
    articleStatus(playlist: any): string {
      if (this.hasArticle(playlist)) {
        return '○'
      } else {
        return '×'
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.delete-button.v-btn.v-btn--tile.v-size--small {
  min-width: 0;
  padding: 0 2px;
}
.v-expansion-panel-header {
  height: 35px;
}
.display-episode {
  text-align: right;
  color: #3498db;
}
.delete-button,
.playlist-image {
  flex: 0 0 30px;
}
.playlist-name,
.playlist-can-be-watch,
.playlist-status,
.display-episode {
  flex: 1 1 300px;
}
</style>
