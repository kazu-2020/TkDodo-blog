<template>
  <div class="base-information pa-3 rounded" style="border: 1px solid #d3d3d3">
    <v-row>
      <v-col cols="6" class="pr-0">
        <h2 class="playlist-title">{{ playlistName }}</h2>
        <div v-show="hasPlaylistId" class="chips">
          <v-chip class="my-1" small :color="publishedStateColor">{{
            publishedState
          }}</v-chip>
          <v-chip class="my-1" color="primary" small @click="copyPlaylistId">
            ID: {{ omittedPlaylisitId }}
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
        </div>
      </v-col>
      <v-col cols="6">
        <v-img
          :src="logoImageUrl(playlist)"
          width="100"
          style="border-radius: 4px; overflow: hidden; margin: 0 auto"
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

interface DataType {
  snackbar: boolean
}

export default Vue.extend({
  name: 'BasicInformationView',
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
    omittedPlaylisitId(): string {
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
    publishedState(): string {
      return this.playlist.publishedState === 'draft' ? '下書き' : '非公開'
    },
    publishedStateColor(): string {
      return this.playlist.publishedState === 'draft'
        ? 'grey lighten-1'
        : 'deep-orange darken-1'
    },
  },
  methods: {
    copyPlaylistId(): void {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.playlist.id)
        this.snackbar = true
      }
    },
    copySeriesId() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.playlist.originalSeriesId)
        this.snackbar = true
      }
    },
    dummyImage(time: any) {
      const logoNumber = (Number(moment(time).format('DD')) % 10) + 1
      return `/dummy/default${logoNumber}/default${logoNumber}-logo.png`
    },
    logoImageUrl(playlist: any) {
      if (playlist === undefined) return ''
      return playlist.logo?.medium?.url || this.dummyImage(playlist.dateCreated)
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
    top: 9px;
    left: 13px;
    color: white;
    font-weight: bold;
  }
}
</style>
