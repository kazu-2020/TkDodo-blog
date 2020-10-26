<template>
  <div>
    <page-title page-title="プレイリストを新規作成" class="mt-4" />
    <v-divider class="ma-2" />
    <v-layout column>
      <v-row>
        <v-col cols="12">
          <v-form ref="form" v-model="valid" class="mb-2">
            <v-text-field
              v-model="name"
              label="プレイリスト名 - Name"
              :rules="nameRules"
              required
              @keydown.enter.prevent="unfocusTextForm"
            />
          </v-form>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <h3>エピソード選定</h3>
        </v-col>
        <v-col cols="12">
          <playlist-episodes-list
            :episodes="items"
            @update-episodes="updateEpisodes"
            @delete-episode="deleteEpisode"
          />
        </v-col>
      </v-row>
      <playlist-episode-search
        :ignore-episodes="items"
        @add-episode="addEpisode"
      />
      <v-row>
        <v-col cols="12" align="center">
          <v-btn color="orange" @click="saveEpisodes">
            上記の内容で保存する
          </v-btn>
        </v-col>
      </v-row>
    </v-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import { Playlist } from '@/types/playlist'
import PlaylistEpisodesList from '~/components/playlists/PlaylistEpisodesList.vue'
import PlaylistEpisodeSearch from '~/components/playlists/PlaylistEpisodeSearch.vue'
import PageTitle from '~/components/common/PageTitle.vue'

interface DataType {
  valid: boolean
  name: string
  nameRules: Array<Function>
  items: Array<any>
}

export default Vue.extend({
  name: 'PlaylistNewListPage',
  components: {
    PageTitle,
    PlaylistEpisodesList,
    PlaylistEpisodeSearch,
  },
  data(): DataType {
    return {
      valid: false,
      name: '',
      nameRules: [
        (v: string) => !!v || 'Name is required',
        (v: string) =>
          (v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
      items: [],
    }
  },
  methods: {
    saveEpisodes() {
      // this.$store.dispatch('loading/startLoading', {
      //   success: '正常に保存できました',
      //   error: '保存できませんでした',
      // })
    },
    updateEpisodes(episodes: any) {
      this.items = episodes
    },
    addEpisode(episode: any) {
      this.items.push(episode)
    },
    deleteEpisode(episode: any) {
      this.items.splice(this.items.indexOf(episode), 1)
    },
  },
})
</script>

<style lang="scss" scoped></style>
