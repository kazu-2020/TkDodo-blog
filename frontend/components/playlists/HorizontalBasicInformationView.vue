<template>
  <div class="preview-container container-fluid white rounded px-5 py-2 mt-4">
    <v-row>
      <v-col cols="2" md="2" sm="4" xs="12">
        <h2 class="playlist-title">{{ playlistName }}</h2>
        <div v-show="hasPlaylistId" class="chips">
          <v-chip class="my-1" small :color="publishedStateColor">{{
            publishedState
          }}</v-chip>
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
        </div>
      </v-col>
      <v-col cols="1" md="1" sm="2" xs="6">
        <v-img
          :src="logoImageUrl(playlist)"
          style="border-radius: 4px; overflow: hidden; margin: 0 auto"
        />
      </v-col>
      <v-col v-show="playlistDescription" cols="2" md="2" sm="4" xs="12">
        <div class="body-2 font-weight-bold mb-2">説明</div>
        <div style="word-wrap: break-word; font-size: 14px">
          {{ playlistDescription }}
        </div>
      </v-col>
      <v-col v-show="hasActorsOrContributors" cols="2" md="2" sm="4" xs="12">
        <div class="body-2 font-weight-bold mb-2">出演者/スタッフ</div>
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
              width="50"
              v-bind="attrs"
              class="actor_contributor_badge"
              v-on="on"
            />
          </template>
          <span>{{ actorContributorName(data) }}</span>
        </v-tooltip>
      </v-col>
      <v-col cols="3" md="3" sm="4" xs="12">
        <div class="body-2 font-weight-bold mb-2">リスト</div>
        <v-list dense class="py-0">
          <v-list-item
            v-for="item in playlistItems"
            :key="item.id"
            class="px-0"
          >
            <v-list-item-icon class="mr-1">
              <v-img
                :src="eyecatchUrl(item)"
                lazy-src="https://placehold.jp/50x28.png"
                width="50"
                height="28"
                class="episode-image"
              />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.name" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="2" md="2" sm="4" xs="12">
        <div class="body-2 font-weight-bold mb-2">記事</div>
        <div style="word-wrap: break-word; font-size: 14px">
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

interface DataType {
  snackbar: boolean
}

export default Vue.extend({
  name: 'HorizontalBasicInformationView',
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
    publishedState(): string {
      return this.playlist?.publishedState === 'draft' ? '下書き' : '非公開'
    },
    publishedStateColor(): string {
      return this.playlist?.publishedState === 'draft'
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
  border-radius: 25px;
  overflow: hidden;
  display: inline-block;
  margin-right: 10px;
  margin-bottom: 16px;
  cursor: pointer;
  background-color: #546e7a;
  width: 50px;
  height: 50px;
  position: relative;

  .actor_contributor_badge_inner {
    display: inline-block;
    position: relative;
    top: -48px;
    left: 16px;
    font-size: 18px;
    color: white;
    font-weight: bold;
    padding: 60px 0px;
  }
}

.v-responsive.v-image.episode-image {
  border-radius: 5px;
}
</style>
