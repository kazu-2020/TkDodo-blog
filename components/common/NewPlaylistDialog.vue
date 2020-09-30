<template>
  <v-dialog v-model="isShowDialog" max-width="600px" persistent>
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
              <v-btn color="text" text @click="hideNewPlaylistDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-form ref="form" v-model="valid">
                <v-text-field
                  v-model="name"
                  label="プレイリスト名 - Name"
                  :rules="nameRules"
                  required
                  @keydown.enter="triggerSubmitNewPlaylist"
                />
                <v-textarea
                  v-model="description"
                  label="説明 - Description"
                  auto-grow
                />
              </v-form>
            </v-col>
          </v-row>
          <v-row justify="center" align-content="center">
            <v-col cols="5">
              <v-btn
                :disabled="!valid"
                depressed
                color="orange"
                large
                @click="submitNewPlaylist"
              >
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
                border="top"
                icon="mdi-alert-outline"
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
      <v-card>
        <v-card-text>
          作成中...
          <v-progress-linear indeterminate class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
  isShowAlert: boolean
  loadingDialog: boolean
  valid: boolean
  name: string
  nameRules: Array<Function>
  description: string
}

export default Vue.extend({
  name: 'NewPlaylistDialog',
  components: {},
  props: {
    isShowDialog: {
      type: Boolean,
      required: false,
    },
  },
  data(): DataType {
    return {
      isShowAlert: false,
      loadingDialog: false,
      valid: false,
      name: '',
      description: '',
      nameRules: [
        (v: String) => !!v || 'Name is required',
        (v: String) =>
          (v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
    }
  },
  methods: {
    triggerSubmitNewPlaylist(event: KeyboardEvent) {
      // 日本語入力中のエンターキーでは何もしない
      if (event.keyCode !== 13) return
      this.submitNewPlaylist()
    },
    submitNewPlaylist() {
      const form: any = this.$refs.form
      form.validate()

      if (this.valid) {
        this.loadingDialog = true
        this.$accessor.playlists.createPlaylists({
          playlist: {
            name: this.name,
            description: this.description,
          },
        })
        this.subscribeSubmitAction()
      }
    },
    subscribeSubmitAction() {
      this.$store.subscribeAction({
        after: (action, state) => {
          if (action.type !== 'playlists/createPlaylists') return

          if (state.playlists.allItems[0].name === this.name) {
            const playlist = state.playlists.allItems[0]
            this.hideNewPlaylistDialog()
            this.$router.push(`/playlists/${playlist.id}`)
          }

          this.loadingDialog = false
        },
        error: () => {
          this.loadingDialog = false
          this.isShowAlert = true
        },
      })
    },
    hideNewPlaylistDialog() {
      this.isShowAlert = false
      this.loadingDialog = false
      this.name = ''
      this.$emit('hide-new-playlist-dialog')
    },
    validate() {
      const form: any = this.$refs.form
      form.validate()
    },
  },
})
</script>
