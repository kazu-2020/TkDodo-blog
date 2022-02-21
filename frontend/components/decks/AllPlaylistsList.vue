<template>
  <div>
    <v-col v-if="playlists.length !== 0" cols="12">
      <div class="body-2 ml-1">全 {{ totalPlaylistsNum }} 件</div>
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th />
              <th />
              <th class="text-left">プレイリスト</th>
              <th class="text-left">アイテム数</th>
              <th class="text-left">記事の有無</th>
              <th class="text-left">視聴可能</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="playlist in playlists"
              :key="`all-playlist-${playlist.playlistUId}`"
              style="cursor: pointer"
              @click.stop="clickPlaylist(playlist)"
            >
              <td>
                <v-btn
                  v-if="!shouldIgnorePlaylist(playlist)"
                  tile
                  small
                  color="orange"
                  class="add_button"
                  @click="addPlaylist(playlist)"
                >
                  <v-icon> mdi-plus </v-icon>
                </v-btn>
                <div v-else>追加済み</div>
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
                TVEpisode: {{ playlist.itemNum }} HowTo: 0<br />
                Event: 0 Recipe: 0
              </td>
              <td>{{ articleStatus(playlist) }}</td>
              <td>
                <v-chip
                  v-if="hasVideo(playlist)"
                  class="mx-2"
                  color="pink"
                  label
                  text-color="white"
                >
                  視聴可
                </v-chip>
                <v-chip
                  v-else
                  class="mx-2"
                  color="grey"
                  label
                  text-color="white"
                >
                  視聴不可
                </v-chip>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Playlist } from 'types/playlist'

export default Vue.extend({
  props: {
    ignorePlaylists: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      playlists: [],
    }
  },
  computed: {
    totalPlaylistsNum(): number {
      return this.playlists.length
    },
  },
  mounted() {
    this.fetchAllPlaylists()
  },
  methods: {
    fetchAllPlaylists(): Playlist[] {
      return []
    },
    shouldIgnorePlaylist(playlist: Playlist) {
      return (
        this.ignorePlaylists.find(
          (ignorePlaylist) => playlist.primaryId === ignorePlaylist.primaryId
        ) !== undefined
      )
    },
    addPlaylist(playlist: Playlist) {
      this.$emit('add-playlist', playlist)
    },
    clickPlaylist(playlist: Playlist) {
      this.$emit('select-playlist', playlist)
    },
    logoUrl(playlist: Playlist) {
      if (playlist?.logo !== undefined) {
        return playlist.logo.medium.url
      } else if ((playlist?.keyvisuals || [])[0] !== undefined) {
        return playlist.keyvisuals[0].small.url
      } else if (playlist?.partOfSeries?.logo !== undefined) {
        return playlist.partOfSeries.logo.medium.url
      }

      return 'https://placehold.jp/40x40.png'
    },
    hasVideo(playlist: Playlist) {
      return playlist.playablePlaylistItemCount !== 0
    },
    hasArticle(playlist: Playlist) {
      return playlist.article.markedBody !== null
    },
    articleStatus(playlist: Playlist): string {
      if (this.hasArticle(playlist)) {
        return '○'
      } else {
        return '×'
      }
    },
  },
})
</script>
