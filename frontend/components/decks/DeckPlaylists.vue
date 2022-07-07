<template>
  <div>
    <v-simple-table>
      <template #default>
        <thead>
          <tr>
            <th class="pr-0" width="83" />
            <th class="text-left pr-0 pl-0" width="340">プレイリスト</th>
            <th class="text-left pr-0 pl-0" width="310">記事の有無</th>
            <th class="text-left pr-0 pl-0">視聴可能エピソード数</th>
          </tr>
        </thead>
      </template>
    </v-simple-table>
    <v-expansion-panels accordion tile focusable>
      <v-expansion-panel
        v-for="playlist in playlists"
        :key="playlist.playlistUId"
        v-model="isExpanded"
        @click="fetchEpisodes(playlist)"
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
              v-if="hasVideo(playlist)"
              class="mx-2"
              color="pink"
              label
              text-color="white"
              >{{ playlist.playableEpisodesCount }}/{{ playlist.itemNum }}
            </v-chip>
            <v-chip v-else class="mx-2" color="grey" label text-color="white"
              >0/{{ playlist.itemNum }}</v-chip
            >
          </td>
          <span class="display-episode">エピソード表示</span>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="pl-16">
          <div v-if="isFetched">
            <div v-if="playlist.itemNum !== 0">
              <div
                v-for="episode in filterPlaylistEpisodes(playlist)"
                :key="`deck-playlist-list-item-ep-${episode.id}`"
              >
                <v-img
                  :src="eyeCatchUrl(episode)"
                  lazy-src="https://placehold.jp/100x56.png"
                  width="44"
                  height="24"
                  class="episode-image float-left mr-1"
                />
              </div>
            </div>
            <div v-else>
              <v-row align="center" justify="center"
                ><v-col class="body-2">エピソードはありません</v-col></v-row
              >
            </div>
          </div>
          <div v-else align="center" class="height-100">
            <v-row v-if="isError" align="center" justify="center"
              ><v-col class="body-2">エラーが発生しました</v-col></v-row
            >
            <v-row v-else align="center" justify="center"
              ><v-col><v-progress-circular indeterminate color="amber" /></v-col
            ></v-row>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
  isError: boolean
  isFetched: boolean
  isExpanded: []
  playlistEpisodes: [
    {
      playlistUId: string
      episodes: []
    }
  ]
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
      isError: false,
      isFetched: false,
      isExpanded: [],
      playlistEpisodes: [{ playlistUId: '', episodes: [] }],
    }
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
    eyeCatchUrl(episode: any) {
      if (episode?.eyecatch !== undefined) {
        return episode.eyecatch.medium.url
      } else if ((episode?.keyvisuals || [])[0] !== undefined) {
        return episode.keyvisuals[0].small.url
      } else if (episode?.partOfSeries?.eyecatch !== undefined) {
        return episode.partOfSeries.eyecatch.medium.url
      }

      return 'https://placehold.jp/100x56.png'
    },
    hasVideo(playlist: any) {
      return playlist.playableEpisodesCount !== 0
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
    fetchEpisodes(playlist: any) {
      this.isFetched = false
      let isAlreadyAdded = false

      for (const item of this.playlistEpisodes) {
        if (item.playlistUId === playlist.playlistUId) {
          isAlreadyAdded = true
          break
        }
      }

      if (isAlreadyAdded) {
        this.isFetched = true
        return
      }

      this.$axios
        .get(`/playlists/${playlist.playlistUId}/playlist_items?limit=10`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        })
        .then((res) => {
          this.playlistEpisodes.push({
            playlistUId: playlist.playlistUId,
            episodes: res.data.items,
          })
        })
        .catch(() => {
          this.isError = true
        })
        .finally(() => {
          this.isFetched = true
        })
    },
    filterPlaylistEpisodes(playlist: any): any {
      for (const playlistEpisode of this.playlistEpisodes) {
        if (playlistEpisode.playlistUId === playlist.playlistUId) {
          return playlistEpisode.episodes
        }
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
.v-expansion-panels {
  z-index: auto !important;
}
.v-expansion-panel-content::v-deep .v-expansion-panel-content__wrap {
  padding-top: 16px;
}
</style>
