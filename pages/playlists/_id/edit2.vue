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
          <basic-information-view :playlist="playlist" />
        </div>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Playlist } from '@/types/playlist'
import PlaylistEpisodesList from '~/components/playlists/PlaylistEpisodesList.vue'
import BasicInformationView from '~/components/playlists/BasicInformationView.vue'

export default Vue.extend({
  name: 'PlaylistIdEdit2Page',
  components: {
    PlaylistEpisodesList,
    BasicInformationView,
  },
  async asyncData({ store, params }) {
    await store.dispatch('playlists/fetchPlaylist', params.id)
  },
  computed: {
    playlist(): Playlist {
      return this.$store.state.playlists.editingPlaylist
    },
    playlistItems(): Array<Object> {
      return this.$store.state.playlists.editingPlaylist.items
    },
  },
  methods: {
    updateEpisodes() {
      // noop
    },
    deleteEpisode() {
      // noop
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
</style>
