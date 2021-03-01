<template>
  <div class="preview-container container-fluid white rounded px-5 py-2 mt-4">
    <v-row>
      <v-col cols="2" md="2" sm="2" xs="6">
        <v-img
          :src="logoImageUrl(playlist)"
          style="border-radius: 4px; overflow: hidden"
          max-height="130"
          max-width="130"
          class="mb-2"
        />
        <div class="body-2 text--darken--1 grey--text">
          エピソード数: 全{{ playlistItemCount }}件
        </div>
      </v-col>
      <v-col cols="2" md="2" sm="2" xs="6">
        <div v-show="hasPlaylistId" class="chips">
          <published-state-badge class="my-1" :playlist="playlist" />
          <span
            v-if="playlist.browsableItemCount === 0"
            style="font-size: 12px; color: black"
          >
            <v-icon>mdi-video-off-outline</v-icon>
          </span>
          <br />
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
          <div class="mt-2">
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
                  width="30"
                  v-bind="attrs"
                  class="actor_contributor_badge"
                  v-on="on"
                />
              </template>
              <span>{{ actorContributorName(data) }}</span>
            </v-tooltip>
          </div>
        </div>
      </v-col>
      <v-col cols="8" md="8" sm="8" xs="8">
        <h2 class="playlist-title">{{ playlistName }}</h2>
        <playlist-preview-episodes-carousel :playlist="playlist" />
      </v-col>
    </v-row>
    <v-row style="border-top: 1px solid #aeaeae">
      <v-col cols="6">
        <div class="mr-4 float-left font-weight-bold subtitle-1">説明</div>
        <div
          style="width: 85%; background-color: #f8f8f8"
          class="float-left rounded pa-3"
        >
          {{ playlistDescription }}
        </div>
      </v-col>
      <v-col cols="6">
        <div class="mr-4 float-left font-weight-bold subtitle-1">記事</div>
        <div
          style="width: 85%; background-color: #f8f8f8"
          class="float-left rounded pa-3"
        >
          {{ plainBody }}
        </div>
      </v-col>
      <v-snackbar v-model="snackbar" timeout="2000">
        コピーしました
        <template #action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
            閉じる
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import PlaylistPreviewEpisodesCarousel from '~/components/playlists/PlaylistPreviewEpisodesCarousel.vue'
import PublishedStateBadge from '~/components/playlists/PublishedStateBadge.vue'

interface DataType {
  snackbar: boolean
}

export default Vue.extend({
  name: 'HorizontalBasicInformationView',
  components: {
    PlaylistPreviewEpisodesCarousel,
    PublishedStateBadge,
  },
  props: {
    playlist: {
      type: Object,
      required: true,
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
      const actors = this.playlist.actor || []
      const contributors = this.playlist.contributor || []

      return actors.concat(contributors).slice(0, 12)
    },
    hasActorsOrContributors(): boolean {
      return this.actorsAndContributors.length !== 0
    },
    hasPlaylistId(): boolean {
      return this.playlist?.id !== undefined
    },
    playlistItems(): Array<Object> {
      const items = this.playlist.items || []
      return items.slice(0, 4)
    },
    playlistItemCount(): number {
      const items = this.playlist.items || []
      return items.length
    },
    playlistName(): string {
      return this.playlist?.name || ''
    },
    playlistSeriesId(): string | undefined {
      return this.playlist?.originalSeriesId
    },
    omittedPlaylisitId(): string {
      const playlistId = this.playlist?.id || ''
      return playlistId.length > 8
        ? playlistId.slice(0, 12) + '...'
        : playlistId
    },
    playlistDescription(): string | undefined {
      return this.playlist?.description?.slice(0, 50)
    },
    plainBody(): string {
      return this.playlist?.article?.plainBody?.slice(0, 50) || ''
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
      return playlist.logo?.medium?.url || this.dummyImage(playlist.dateCreated)
    },
    eyecatchUrl(item: any): string {
      if (item.eyecatch !== undefined) {
        return item.eyecatch.medium.url
      } else {
        return 'https://placehold.jp/50x28.png'
      }
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
  border-radius: 15px;
  overflow: hidden;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 4px;
  cursor: pointer;
  background-color: #546e7a;
  width: 30px;
  height: 30px;
  position: relative;

  .actor_contributor_badge_inner {
    display: inline-block;
    position: relative;
    top: -48px;
    left: 9px;
    font-size: 14px;
    color: white;
    font-weight: bold;
    padding: 52px 0px;
  }
}

.v-responsive.v-image.episode-image {
  border-radius: 5px;
}
</style>
