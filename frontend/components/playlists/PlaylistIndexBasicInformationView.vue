<template>
  <div class="base-information pa-3 rounded" style="border: 1px solid #d3d3d3">
    <v-row>
      <v-col cols="12">
        <h2 class="playlist-title d-inline mr-4">{{ playlistName }}</h2>
        <div v-show="hasPlaylistId" class="chips d-inline">
          <api-state-badge class="my-1" :playlist="playlist" />
          <v-chip class="my-1" color="primary" small @click="copyPlaylistUId">
            UId: {{ omittedPlaylisitUId }}
          </v-chip>
          <v-chip class="my-1" color="primary" small @click="copyPlaylistId">
            Id: {{ playlistId }}
          </v-chip>
          <v-chip
            v-if="playlistSeriesId"
            class="my-1"
            color="secondary"
            small
            @click="copySeriesId"
          >
            SeriesID: {{ playlistSeriesId }}
          </v-chip>
          <v-chip
            v-if="layoutPattern"
            class="my-1"
            color="purple darken-2 white--text"
            small
          >
            {{ layoutPattern }}
          </v-chip>
        </div>
      </v-col>
      <v-col cols="12">
        <v-img
          :src="logoImageUrl(playlist)"
          :aspect-ratio="1 / 1"
          width="73"
          class="d-inline-block elevation-3"
        />
        <v-img
          :src="eyecatchImageUrl(playlist)"
          :aspect-ratio="16 / 9"
          width="130"
          class="d-inline-block elevation-3"
        />
        <v-img
          :src="heroImageUrl(playlist)"
          :aspect-ratio="3 / 1"
          width="220"
          class="d-inline-block elevation-3"
        />
      </v-col>
      <v-col v-if="playlistDetailedCatch" cols="12" class="body-2 py-2">
        <div class="body-3 font-weight-bold mb-2">キャッチコピー</div>
        - {{ playlistDetailedCatch }} -
      </v-col>
      <v-col
        v-if="playlistDescription"
        cols="12"
        class="body-2 py-2"
        style="word-wrap: break-word"
      >
        <div class="body-3 font-weight-bold mb-2">説明</div>
        {{ playlistDescription }}
      </v-col>
      <v-col v-if="hasActorsOrContributors" cols="auto" class="body-2">
        <div class="body-3 font-weight-bold mb-2">出演者/スタッフ</div>
        <v-tooltip
          v-for="(data, index) in actorsAndContributors"
          :key="`actor-contributor-${index}`"
          bottom
        >
          <template #activator="{ on, attrs }">
            <v-img
              :src="actorContributorImageUrl(data)"
              width="60"
              v-bind="attrs"
              class="actor_contributor_badge"
              v-on="on"
            >
              <div
                v-if="noActorContributorImage(data)"
                class="actor_contributor_badge_inner"
              >
                {{ actorContributorName(data).slice(0, 1) }}
              </div>
            </v-img>
          </template>
          <span>{{ actorContributorName(data) }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" timeout="2000">
      コピーしました
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import ApiStateBadge from '~/components/playlists/ApiStateBadge.vue'

interface DataType {
  snackbar: boolean
}

export default Vue.extend({
  name: 'PlaylistIndexBasicInformationView',
  components: {
    ApiStateBadge,
  },
  props: {
    playlist: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      snackbar: false,
    }
  },
  computed: {
    actorsAndContributors(): Array<Object> {
      const actors = this.playlist?.actor || []
      const contributors = this.playlist?.contributor || []

      return actors.concat(contributors).slice(0, 12)
    },
    hasActorsOrContributors(): boolean {
      return this.actorsAndContributors.length !== 0
    },
    hasPlaylistId(): boolean {
      return this.playlist?.id !== undefined
    },
    playlistName(): string {
      return this.playlist?.name || ''
    },
    playlistId(): string {
      return this.playlist?.originalId || ''
    },
    omittedPlaylisitUId(): string {
      const playlistId = this.playlist?.id || ''
      return playlistId.length > 8 ? playlistId.slice(0, 8) + '...' : playlistId
    },
    playlistSeriesId(): string | undefined {
      return this.playlist?.originalSeriesId
    },
    playlistDetailedCatch(): string | undefined {
      return this.playlist?.detailedCatch
    },
    playlistDescription(): string | undefined {
      return this.playlist?.description
    },
    layoutPattern(): string | undefined {
      return this.playlist?.layoutPattern
    },
  },
  methods: {
    copyPlaylistUId(): void {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.playlist.id)
        this.snackbar = true
      }
    },
    copyPlaylistId(): void {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.playlist.originalId)
        this.snackbar = true
      }
    },
    copySeriesId() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.playlist.originalSeriesId)
        this.snackbar = true
      }
    },
    dummyImage(time: any, type: string) {
      const logoNumber = (Number(moment(time).format('DD')) % 10) + 1
      return `/dummy/default${logoNumber}/default${logoNumber}-${type}.png`
    },
    logoImageUrl(playlist: any) {
      if (playlist === undefined) return ''
      return (
        playlist.logo?.medium?.url ||
        this.dummyImage(playlist.dateCreated, 'logo')
      )
    },
    eyecatchImageUrl(playlist: any) {
      if (playlist === undefined) return ''
      return (
        playlist.eyecatch?.medium?.url ||
        this.dummyImage(playlist.dateCreated, 'eyecatch')
      )
    },
    heroImageUrl(playlist: any) {
      if (playlist === undefined) return ''
      return (
        playlist.hero?.medium?.url ||
        this.dummyImage(playlist.dateCreated, 'hero')
      )
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
  },
})
</script>

<style lang="scss" scoped>
.playlist-title {
  font-size: 16px;
  font-weight: bold;
}

.detailed-name-ruby {
  font-size: 14px;
}

.actor_contributor_badge {
  border-radius: 30px;
  overflow: hidden;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 16px;
  cursor: pointer;
  background-color: #546e7a;
  width: 60px;
  height: 60px;
  position: relative;

  .actor_contributor_badge_inner {
    display: inline-block;
    position: relative;
    top: -40px;
    left: 20px;
    font-size: 20px;
    color: white;
    font-weight: bold;
    padding: 60px 0px;
  }
}
</style>
