<template>
  <v-row class="preview-container-inner">
    <v-col cols="2" md="2" sm="4" xs="12">
      <h2 class="playlist-title">{{ playlist.name }}</h2>
      <div class="chips">
        <v-chip class="my-1" small> 非公開 </v-chip>
        <br />
        <v-chip class="my-1" color="primary" small @click="copyPlaylistId">
          ID: {{ playlist.id.slice(0, 12) + '...' }}
        </v-chip>
        <v-chip
          v-if="playlist.originalSeriesId"
          class="my-1"
          color="secondary"
          small
          @click="copySeriesId"
        >
          SeriesID: {{ playlist.originalSeriesId }}
        </v-chip>
      </div>
    </v-col>
    <v-col cols="1" md="1" sm="2" xs="6">
      <v-img
        :src="logoImageUrl(playlist)"
        style="border-radius: 4px; overflow: hidden; margin: 0 auto"
      />
    </v-col>
    <v-col v-show="playlist.description" cols="2" md="2" sm="4" xs="12">
      <div style="word-wrap: break-word; font-size: 14px">
        {{ playlist.description.slice(0, 50) }}
      </div>
    </v-col>
    <v-col v-show="hasActorsOrContributors" cols="2" md="2" sm="4" xs="12">
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
    <v-col cols="3" md="3" sm="4" xs="12">
      <v-list dense>
        <v-list-item v-for="item in playlistItems" :key="item.id" class="px-0">
          <v-list-item-icon class="mr-1">
            <v-img
              :src="eyecatchUrl(item)"
              lazy-src="https://placehold.jp/50x28.png"
              width="50"
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
      <div style="word-wrap: break-word; font-size: 14px">
        {{ playlist.article.plainBody.slice(0, 50) }}
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
    playlistItems(): Array<Object> {
      return this.$store.state.playlists.editingPlaylist.items.slice(0, 4)
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
        return ''
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
.preview-container-inner {
  background-color: white;
  border-radius: 6px;
}

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
    top: 6px;
    left: 12px;
    color: white;
    font-weight: bold;
  }
}
</style>
