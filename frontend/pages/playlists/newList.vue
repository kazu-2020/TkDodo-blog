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
              class="new-playlist-name"
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
        :keywords.sync="keywords"
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
    <v-snackbar v-model="snackBar" right top :timeout="3000" color="pink">
      {{ snackBarMessage }}
    </v-snackbar>
    <v-dialog v-model="loadingDialog" hide-overlay persistent width="300">
      <v-card>
        <v-card-text>
          作成中...
          <v-progress-linear indeterminate class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
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
  keywords: string
  loadingDialog: boolean
  snackBar: boolean
  snackBarMessage: string
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
      keywords: '',
      loadingDialog: false,
      snackBar: false,
      snackBarMessage: '',
    }
  },
  computed: {
    itemsParam(): Array<object> {
      return this.items.map((v) => {
        return {
          episode_id: v.id,
        }
      })
    },
  },
  methods: {
    saveEpisodes() {
      this.validate()

      if (!this.valid) {
        this.snackBar = true
        this.snackBarMessage = 'プレイリストのタイトルを入力してください'
        return
      }

      this.$store.dispatch('loading/startLoading', {
        success: '保存しました',
        error: '保存失敗しました',
      })
      this.loadingDialog = true

      this.$accessor.playlists.createPlaylists({
        playlist: {
          name: this.name,
          playlist_items_attributes: this.itemsParam,
        },
      })
      this.subscribeSubmitAction()
    },
    subscribeSubmitAction() {
      this.$store.subscribeAction({
        after: (action, state) => {
          if (action.type !== 'playlists/createPlaylists') return

          if (state.playlists.allItems[0].name === this.name) {
            const playlist = state.playlists.allItems[0]

            this.$router.push(`/playlists/${playlist.id}`)
            this.$store.dispatch('loading/succeedLoading')
          }

          this.loadingDialog = false
        },
        error: () => {
          this.$store.dispatch('loading/failLoading')
          this.loadingDialog = false
        },
      })
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
    unfocusTextForm() {
      // noop
    },
    validate() {
      const form = this.$refs.form as any
      form.validate()
    },
  },
})
</script>

<style lang="scss" scoped></style>
