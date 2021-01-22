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
      <v-col cols="12" class="pt-0 body-2">
        直近放送日: {{ episodeRecentBroadcastDate }}
      </v-col>
      <v-col v-show="genres.length !== 0" cols="12" class="py-0">
        <v-chip
          v-for="genre in genres"
          :key="`genre-${genre.id}`"
          small
          class="my-1 mr-2"
          color="blue-grey darken-1"
          style="color: white"
        >
          {{ genre.name }}
        </v-chip>
      </v-col>
      <v-col v-if="hasActorsOrContributors" cols="auto">
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
            cols="6"
            v-for="relatedPlaylist in relatedPlaylists"
            :key="relatedPlaylist.id"
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
            <div class="thmubnail" style="position: relative">
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

moment.locale('ja')

interface DataType {
  eyecatchUrl: string
  drawer: boolean
  width: number
  relatedPlaylists: Array<Playlist>
}

export default Vue.extend({
  name: 'EpisodePreviewDrawer',
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
    genres(): string[] {
      const formatGenres = this.episode?.identifierGroup?.formatGenreTag || []
      const themeGenres = this.episode?.identifierGroup?.themeGenreTag || []
      return formatGenres.concat(themeGenres)
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
  margin-bottom: 16px;
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
  margin-bottom: 4px;
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
</style>
