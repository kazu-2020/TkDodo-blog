<template>
  <div>
    <v-row justify="space-between" class="px-3 pt-3">
      <v-col cols="4" class="subtitle">編成可能なプレイリスト</v-col>
      <v-col cols="3">
        <div class="body-2 ml-1 text-right">全 {{ totalPlaylistsNum }} 件</div>
      </v-col>
    </v-row>
    <v-col v-if="playlistLoading" cols="12">
      <v-skeleton-loader class="mx-auto" type="list-item-three-line" />
    </v-col>
    <v-col v-if="isError" cols="12">
      <div>プレイリストの取得に失敗しました</div>
    </v-col>
    <v-col v-if="playlists.length !== 0" cols="12" class="px-0">
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th class="px-0" width="5.5%" />
              <th class="pl-0" width="25%" colspan="2">プレイリスト</th>
              <th class="text-left pr-0 pl-0" width="22.3%">記事の有無</th>
              <th class="text-left pr-0 pl-0">視聴可能エピソード数</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="playlist in playlists"
              :key="`all-playlist-${playlist.playlistUId}`"
              style="cursor: pointer"
              @click.stop="clickPlaylist(playlist)"
            >
              <td align="center" class="px-0">
                <v-btn
                  v-if="!shouldIgnorePlaylist(playlist)"
                  tile
                  color="orange"
                  class="add_button"
                  height="21px"
                  width="21px"
                  min-width="21px"
                  @click="addPlaylist(playlist)"
                >
                  <v-icon> mdi-plus </v-icon>
                </v-btn>
                <div v-else>追加済み</div>
              </td>
              <td class="px-0" width="3%">
                <v-img
                  :src="logoUrl(playlist)"
                  lazy-src="https://placehold.jp/40x40.png"
                  width="30"
                  height="30"
                  class="ma-2"
                />
              </td>
              <td align="left" class="pl-5">
                {{ playlist.name }}
              </td>
              <td class="pl-0">{{ articleStatus(playlist) }}</td>
              <td class="px-0">
                <v-chip
                  v-if="hasVideo(playlist)"
                  class="video-count-chip mx-0"
                  color="pink"
                  label
                  text-color="white"
                >
                  {{ playlist.playableItemsCount }}/{{ playlist.itemNum }}
                </v-chip>
                <v-chip
                  v-else
                  class="video-count-chip mx-0"
                  color="grey"
                  label
                  text-color="white"
                >
                  0/{{ playlist.itemNum }}
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
      isError: false,
      playlistLoading: false,
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
      this.playlistLoading = true

      this.$axios
        .get(
          `/playlists?per=1000&with_subtype_item_count=1&with_episode_count=1`
        )
        .then((res) => {
          this.playlists = res.data.playlists
        })
        .catch(() => {
          this.isError = true
        })
        .finally(() => {
          this.playlistLoading = false
        })

      return []
    },
    shouldIgnorePlaylist(playlist: any) {
      return (
        this.ignorePlaylists.find(
          (ignorePlaylist: any) =>
            playlist.primaryId === ignorePlaylist.primaryId
        ) !== undefined
      )
    },
    addPlaylist(playlist: Playlist) {
      this.$emit('add-playlist', playlist)
    },
    clickPlaylist(playlist: Playlist) {
      this.$emit('select-playlist', playlist)
    },
    logoUrl(playlist: any) {
      if (playlist?.logo !== undefined) {
        return playlist.logo.medium.url
      }

      return 'https://placehold.jp/40x40.png'
    },
    hasVideo(playlist: any) {
      return playlist.playableItemsCount !== 0
    },
    hasArticle(playlist: any) {
      return playlist.article?.markedBody !== null
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
