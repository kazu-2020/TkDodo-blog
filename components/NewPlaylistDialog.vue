<template>
  <v-dialog v-model="isShowDialog" max-width="600px">
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="10" sm="10" md="10">
            <v-card-title>
              <span class="headline">プレイリストを作成</span>
            </v-card-title>
          </v-col>
          <v-col cols="2" sm="2" md="2">
            <v-card-actions>
              <v-btn color="white darken-1" text @click="hideNewPlaylistDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6" sm="12" md="5">
              <v-card class="pa-2" tile>
                <playlist-thumbnail />
              </v-card>
            </v-col>
            <v-col cols="6" sm="12" md="6">
              <v-text-field
                v-model="name"
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
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'

@Component({
  components: {
    PlaylistThumbnail: () => import('~/components/PlaylistThumbnail.vue'),
  },
})
export default class NewPlaylistDialog extends Vue {
  isShowAlert = false
  loadingDialog = false
  name = ''

  @Prop({ type: Boolean, required: false })
  isShowDialog: boolean = false

  submitNewPlaylist() {
    this.loadingDialog = true
    this.$store.dispatch('playlists/createPlaylists', {
      playlist: {
        name: this.name,
      },
    })
    this.subscribeSubmitAction()
  }

  subscribeSubmitAction() {
    this.$store.subscribeAction({
      after: (action, state) => {
        if (action.type !== 'playlists/createPlaylists') return

        if (state.playlists.allItems[0].name === this.name) {
          const playlist = state.playlists.allItems[0]
          this.initializeNewPlaylistDialog()
          this.$router.push(`/playlists/${playlist.id}`)
        } else {
          this.isShowAlert = true
        }

        this.loadingDialog = false
      },
    })
  }

  initializeNewPlaylistDialog() {
    this.isShowAlert = false
    this.name = ''
    this.hideNewPlaylistDialog()
  }

  @Emit('hide-new-playlist-dialog')
  hideNewPlaylistDialog() {}
}
</script>
