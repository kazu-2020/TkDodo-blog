<template>
  <v-navigation-drawer
    v-model="drawer"
    absolute
    temporary
    right
    hide-overlay
    :width="drawerWidth"
    style="position: fixed"
    class="preview-drawer"
  >
    <v-row justify="space-between">
      <v-col cols="10" class="subtitle-2 font-weight-bold mt-2">
        {{ episodeName }}
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-img
          :src="eyecatchUrl"
          lazy-src="https://placehold.jp/360x202.png?text=EyeCatch"
          class="episode-image"
        />
      </v-col>
      <v-col cols="12" class="pt-0 body-2">
        {{ episodeDescription }}
      </v-col>
      <v-col cols="12" class="py-0 body-2">
        直近放送日: {{ episodeRecentBroadcastDate }}
      </v-col>
      <episode-preview-genres-list :episode="episode" />
      <v-col v-if="hasActorsOrContributors" cols="12" class="pb-0">
        <v-tooltip
          v-for="(data, index) in actorsAndContributors"
          :key="`episode-actor-contributor-${index}`"
          bottom
        >
          <template #activator="{ on, attrs }">
            <div
              v-if="noActorContributorImage(data)"
              class="actor_contributor_badge"
              v-bind="attrs"
              v-on="on"
            >
              <div class="actor_contributor_badge_inner">
                {{ actorContributorName(data).slice(0, 1) }}
              </div>
            </div>
            <v-img
              v-else
              :src="actorContributorImageUrl(data)"
              width="40"
              v-bind="attrs"
              class="actor_contributor_badge"
              v-on="on"
            />
          </template>
          <span>{{ actorContributorName(data) }}</span>
        </v-tooltip>
      </v-col>
      <v-col v-if="relatedPlaylists.length > 0" class="pa-3">
        <div
          class="body-2 font-weight-bold"
          style="border-left: 4px solid orange; padding-left: 10px"
        >
          {{ episode.name }} が含まれるプレイリスト
        </div>
        <v-row class="px-4">
          <v-col
            v-for="relatedPlaylist in relatedPlaylists"
            :key="relatedPlaylist.id"
            cols="6"
          >
            <nuxt-link
              :to="{
                name: 'playlists-id',
                params: { id: relatedPlaylist.id },
              }"
              class="body-2 related-playlist-title"
            >
              {{ relatedPlaylist.name }}
            </nuxt-link>
            <div class="thmubnail mt-2" style="position: relative">
              <nuxt-link
                :to="{
                  name: 'playlists-id',
                  params: { id: relatedPlaylist.id },
                }"
              >
                <v-img
                  :src="logoUrl(relatedPlaylist)"
                  lazy-src="https://placehold.jp/140x140.png"
                  width="140"
                  height="140"
                  class="playlist-image"
                />
                <div
                  v-if="playlist.id === relatedPlaylist.id"
                  class="current-playlist-badge"
                >
                  現在編集中
                </div>
              </nuxt-link>
            </div>
            <div class="genre-block">
              <div style="display: inline-block">
                <div style="font-size: 8px">フォーマット</div>
                <div
                  v-if="relatedPlaylist.formatGenreName.length !== 0"
                  class="genre-badge format-genre-badge"
                >
                  {{ relatedPlaylist.formatGenreName }}
                </div>
                <div v-if="relatedPlaylist.formatGenreName.length === 0">-</div>
              </div>
              /
              <div style="display: inline-block">
                <div style="font-size: 8px">テーマ</div>
                <div
                  v-if="relatedPlaylist.themeGenreName.length !== 0"
                  class="genre-badge theme-genre-badge"
                >
                  {{ relatedPlaylist.themeGenreName }}
                </div>
                <div
                  v-if="relatedPlaylist.themeGenreName.length === 0"
                  class="genre-badge"
                >
                  -
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { Playlist } from '@/types/playlist'
import EpisodePreviewGenresList from '~/components/playlists/EpisodePreviewGenresList.vue'

moment.locale('ja')

interface DataType {
  eyecatchUrl: string
  drawer: boolean
  width: number
  relatedPlaylists: Array<Playlist>
}

export default Vue.extend({
  name: 'EpisodePreviewDrawer',
  components: {
    EpisodePreviewGenresList,
  },
  props: {
    playlist: {
      type: Object,
      required: false,
      default: () => {},
    },
    episode: {
      type: Object,
      required: false,
      default: () => {},
    },
    visible: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data(): DataType {
    return {
      eyecatchUrl: 'https://placehold.jp/360x202.png?text=EyeCatch',
      drawer: false,
      width: window.innerWidth,
      relatedPlaylists: [],
    }
  },
  computed: {
    episodeName(): string {
      return this.episode?.name || ''
    },
    episodeDescription(): string {
      return this.episode?.description || ''
    },
    episodeRecentBroadcastDate(): string {
      const date = this.episode?.detailedRecentEvent?.startDate
      if (date) {
        return moment(date).format('YYYY年M月DD日（ddd）HH:mm ~')
      } else {
        return '-'
      }
    },
    actorsAndContributors(): Array<Object> {
      const actors = this.episode?.actors || []
      const contributors = this.episode?.contributors || []

      return actors.concat(contributors).slice(0, 12)
    },
    hasActorsOrContributors(): boolean {
      return this.actorsAndContributors.length !== 0
    },
    drawerWidth(): number {
      const halfSize = this.width * 0.4
      return Math.min(halfSize, 400)
    },
  },
  watch: {
    episode: {
      handler(newEpisode) {
        if (newEpisode?.eyecatch !== undefined) {
          this.eyecatchUrl = newEpisode.eyecatch.main.url
        } else {
          this.eyecatchUrl = 'https://placehold.jp/360x202.png?text=EyeCatch'
        }
        this.fetchPlaylists()
      },
      deep: true,
    },
    visible: {
      handler(newValue) {
        this.drawer = newValue
      },
      immediate: true,
    },
    drawer: {
      handler(newValue) {
        if (!newValue) this.closeDrawer()
      },
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize(): void {
      this.width = window.innerWidth
    },
    actorContributorName(data: any): string {
      return data.person?.name || data.organization?.name || ''
    },
    actorContributorImageUrl(data: any): string {
      return (
        data.person?.image?.small?.url ||
        data.organization?.image?.small?.url ||
        ''
      )
    },
    noActorContributorImage(data: any): boolean {
      return this.actorContributorImageUrl(data) === ''
    },
    closeDrawer() {
      this.relatedPlaylists = []
      this.$emit('close-drawer')
    },
    fetchPlaylists(): void {
      if (this.relatedPlaylists.length !== 0) return
      if (this.episode === undefined) return

      this.$axios.get(`/episodes/${this.episode.id}/playlists`).then((res) => {
        console.log(res)
        this.relatedPlaylists = res.data.playlists
      })
    },
    logoUrl(item: any): string {
      if (item.logo !== undefined) {
        return item.logo.medium.url
      } else {
        return 'https://placehold.jp/140x140.png'
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.preview-drawer {
  position: fixed;
  top: 160px;
  z-index: 100;
  padding: 0 20px;
  background-color: white;
  width: 400px;
  height: calc(100vh - 180px);
  overflow: scroll;
  right: 0;
  box-shadow: 0 10px 25px 0 rgba(0, 0, 0, 0.5);
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.episode-image {
  border-radius: 5px;
}

.actor_contributor_badge {
  border-radius: 20px;
  overflow: hidden;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  background-color: #546e7a;
  width: 40px;
  height: 40px;
  position: relative;

  .actor_contributor_badge_inner {
    display: inline-block;
    position: relative;
    top: 6px;
    left: 12px;
    color: white;
    font-weight: bold;
  }
}

.slide-enter-active,
.slide-leave-active {
  transform: translate(0px, 0px);
  transition: transform 300ms ease-in-out 0ms;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(100vw) translateX(0px);
}

.related-playlist-title {
  color: black;
  font-weight: bold;
  text-decoration: none;
}

.playlist-image {
  border-radius: 5px;
  border: 1px solid #d3d3d3;
  width: 100%;
}

.current-playlist-badge {
  background-color: orange;
  color: white;
  display: inline-block;
  padding: 2px 5px;
  border-radius: 5px;
  position: absolute;
  top: 8px;
  font-size: 12px;
  right: 20px;
}

.format-genre-badge {
  display: inline-block;
  font-size: 10px;
  background-color: #acdce2;
  border-radius: 15px;
  color: black;
  font-weight: bold;
  padding: 1px 5px;
}

.theme-genre-badge {
  display: inline-block;
  font-size: 10px;
  background-color: #fdacaf;
  border-radius: 15px;
  color: black;
  font-weight: bold;
  padding: 1px 5px;
}
</style>
