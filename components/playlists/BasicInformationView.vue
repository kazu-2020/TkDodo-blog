<template>
  <div
    class="base-information"
    style="border: 1px solid #d3d3d3; border-radius: 14px; padding: 0 8px"
  >
    <v-row>
      <v-col cols="6" class="pr-0">
        <h2 class="playlist-title">{{ playlist.name }}</h2>
        <div class="chips">
          <v-chip class="my-1" small> 非公開 </v-chip>
          <v-chip class="my-1" color="primary" small @click="copyPlaylistId">
            ID: {{ playlist.id.slice(0, 8) + '...' }}
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
      <v-col cols="6">
        <v-img
          :src="logoImageUrl(playlist)"
          width="100"
          style="border-radius: 4px; overflow: hidden; margin: 0 auto"
        />
      </v-col>
      <v-col v-if="playlist.detailedCatch" cols="12" class="body-2 py-2">
        - {{ playlist.detailedCatch }} -
      </v-col>
      <v-col
        v-if="playlist.description"
        cols="12"
        class="body-2 py-2"
        style="word-wrap: break-word"
      >
        {{ playlist.description }}
      </v-col>
      <v-col v-if="hasActorsOrContributors" cols="auto">
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
    top: 6px;
    left: 12px;
    color: white;
    font-weight: bold;
  }
}
</style>
