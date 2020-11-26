<template>
  <v-layout column style="position: relative">
    <v-row style="position: relative" class="mt-4">
      <v-col cols="auto">
        <div class="step-wrapper">
          <div class="arrow-steps clearfix">
            <div class="step current"><span>リスト (NItemList)</span></div>
            <div class="step"><span>記事 (NArticle)</span></div>
            <div class="step"><span>基本情報(NSeries)</span></div>
          </div>
        </div>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="orange"
          class="save-button"
          elevation="0"
          style="position: absolute; right: 0"
          >保存する</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9" class="list-item-container mt-4">
        <h2>リスト</h2>
        <playlist-episodes-list
          :episodes="playlistItems"
          @update-episodes="updateEpisodes"
          @delete-episode="deleteEpisode"
        />
      </v-col>
      <v-col cols="3" class="preview-container">
        <div class="preview-container-inner mt-1 pa-2">
          <div
            class="base-information"
            style="
              border: 1px solid #d3d3d3;
              border-radius: 14px;
              padding: 0 8px;
            "
          >
            <v-row>
              <v-col cols="6" class="pr-0">
                <h2 class="playlist-title">{{ playlist.name }}</h2>
                <div class="chips">
                  <v-chip class="my-1" small> 非公開 </v-chip>
                  <v-chip
                    class="my-1"
                    color="primary"
                    small
                    @click="copyPlaylistId"
                  >
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
              <v-col
                v-if="playlist.detailedCatch"
                cols="12"
                class="body-2 py-2"
              >
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
              <v-col
                v-if="hasActorsOrContributors"
                cols="auto"
                style="width: 230px"
                class="hidden-sm-and-down"
              >
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
          </div>
        </div>
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
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { Playlist } from '@/types/playlist'
import PlaylistEpisodesList from '~/components/playlists/PlaylistEpisodesList.vue'

interface DataType {
  snackbar: boolean
}

export default Vue.extend({
  name: 'PlaylistIdEdit2Page',
  components: {
    PlaylistEpisodesList,
  },
  async asyncData({ store, params }) {
    await store.dispatch('playlists/fetchPlaylist', params.id)
  },
  data(): DataType {
    return {
      snackbar: false,
    }
  },
  computed: {
    playlist(): Playlist {
      return this.$store.state.playlists.editingPlaylist
    },
    playlistItems(): Array<Object> {
      return this.$store.state.playlists.editingPlaylist.items
    },
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
    dummyImage(time: any) {
      const logoNumber = (Number(moment(time).format('DD')) % 10) + 1
      return `/dummy/default${logoNumber}/default${logoNumber}-logo.png`
    },
    logoImageUrl(playlist: any) {
      return playlist.logo?.medium?.url || this.dummyImage(playlist.dateCreated)
    },
    updateEpisodes() {
      // noop
    },
    deleteEpisode() {
      // noop
    },
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
.step-wrapper {
  display: table-cell;
  height: 40px;
  vertical-align: middle;
}

.arrow-steps .step {
  font-size: 14px;
  text-align: center;
  color: #000;
  cursor: default;
  padding: 7px 10px 8px 30px;
  min-width: 180px;
  float: left;
  position: relative;
  background-color: white;
  border: 1px solid #cecece;
}

.arrow-steps .step:before {
  content: ' ';
  position: absolute;
  top: 0;
  right: -21px;
  width: 0;
  height: 0;
  border-top: 19px solid transparent;
  border-bottom: 17px solid transparent;
  border-left: 19px solid #cecece;
  z-index: 4;
}

.arrow-steps .step:after {
  content: ' ';
  position: absolute;
  top: 0;
  right: -19px;
  width: 0;
  height: 0;
  border-top: 19px solid transparent;
  border-bottom: 17px solid transparent;
  border-left: 19px solid white;
  z-index: 5;
}

.arrow-steps .current.step:after {
  border-left: 19px solid #2f2d2e;
}

.arrow-steps .step:last-child {
  border-right: 2px solid #cecece;
}

.arrow-steps .step:last-child:before {
  right: -22px;
  border-top: 20px solid transparent;
  border-bottom: 17px solid transparent;
  border-left: 20px solid #cecece;
}

.arrow-steps .step:last-child:after {
  right: -20px;
  border-top: 20px solid transparent;
  border-bottom: 17px solid transparent;
  border-left: 20px solid white;
}

.arrow-steps .current.step:last-child:after {
  border-left: 20px solid #2f2d2e;
}

.arrow-steps .step span {
  position: relative;
}

.arrow-steps .step span:before {
  opacity: 0;
  content: '✔';
  position: absolute;
  top: -2px;
  left: -20px;
}

.arrow-steps .step.done span:before {
  opacity: 1;
  -webkit-transition: opacity 0.3s ease 0.5s;
  -moz-transition: opacity 0.3s ease 0.5s;
  -ms-transition: opacity 0.3s ease 0.5s;
  transition: opacity 0.3s ease 0.5s;
}

.arrow-steps .step.current {
  color: #fff;
  background-color: #2f2d2e;
  font-weight: bold;
}

.save-button {
  color: white;
  width: 140px;
}

.list-item-container {
  background-color: white;
  border-radius: 6px;
}

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
