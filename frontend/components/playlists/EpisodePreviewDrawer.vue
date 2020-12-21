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
    </v-row>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

moment.locale('ja')

interface DataType {
  eyecatchUrl: string
  drawer: boolean
  width: number
}

export default Vue.extend({
  name: 'EpisodePreviewDrawer',
  props: {
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
      this.$emit('close-drawer')
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
</style>
