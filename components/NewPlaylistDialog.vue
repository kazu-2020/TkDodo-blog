<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-list-item-title class="playlist_new" v-on="on">
        新規作成
      </v-list-item-title>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">プレイリストを作成</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6" sm="12" md="5">
              <v-card class="pa-2" tile>
                <v-list-item-avatar tile size="200" color="grey" />
              </v-card>
            </v-col>
            <v-col cols="6" sm="12" md="6">
              <v-text-field
                v-model="title"
                label="プレイリスト名 - Name"
                required
              />
              <v-text-field
                label="ふりがな - Detailed Series Name Ruby"
                required
              />
              <v-textarea label="説明 - Description" auto-grow />
            </v-col>
          </v-row>
          <v-row justify="center" align-content="center">
            <v-col cols="5">
              <v-btn depressed color="orange" large @click="submitNewPlaylist">
                この内容で新規作成する
              </v-btn>
              <small>* 内容は後で変更できます</small>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-alert
                :value="isShowAlert"
                color="pink"
                dark
                border="top"
                icon="mdi-alert-outline n"
                transition="scale-transition"
              >
                途中でエラーが発生しました。タイトルを確認後、再度お試しください。
              </v-alert>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="white darken-1" text @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="loadingDialog" hide-overlay persistent width="300">
      <v-card color="grey darken-3" dark>
        <v-card-text>
          作成中...
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class NewPlaylistDialog extends Vue {
  dialog = false
  isShowAlert = false
  loadingDialog = false
  title = ''

  submitNewPlaylist() {
    this.loadingDialog = true
    this.$store.dispatch('playlists/createPlaylists', {
      playlist: {
        title: this.title,
      },
    })

    this.$store.subscribeAction({
      after: (action, state) => {
        if (action.type !== 'playlists/createPlaylists') return

        if (state.playlists.allItems[0].title === this.title) {
          const playlist = state.playlists.allItems[0]
          this.$router.push(`/playlists/${playlist.id}`)
        } else {
          this.isShowAlert = true
        }

        this.loadingDialog = false
      },
    })
  }
}
</script>

<style scoped>
.playlist_new {
  cursor: pointer;
}
</style>
