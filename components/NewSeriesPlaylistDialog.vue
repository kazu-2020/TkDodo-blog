<template>
  <v-dialog v-model="isShowDialog" max-width="600px" persistent>
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="10" sm="10" md="10">
            <v-card-title>
              <span class="headline">
                シリーズからプレイリスト作成
              </span>
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
            <v-col cols="12">
              <v-form ref="form" v-model="valid">
                <v-text-field
                  v-model="seriesId"
                  :rules="seriesIdRules"
                  label="シリーズID - TVSeries ID"
                />
              </v-form>
            </v-col>
          </v-row>
          <v-row justify="center" align-content="center">
            <v-col cols="auto">
              <v-btn
                :disabled="!valid"
                depressed
                color="orange"
                large
                @click="submitNewSeriesPlaylist"
              >
                このシリーズIDでプレイリストを作る
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-alert
                :value="isShowAlert"
                color="pink"
                dark
                border="top"
                icon="mdi-alert-outline"
                transition="scale-transition"
              >
                途中でエラーが発生しました。シリーズIDを確認してください
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
import Vue from 'vue'

interface DataType {
  isShowAlert: boolean
  loadingDialog: boolean
  valid: boolean
  seriesId: string
  seriesIdRules: Array<Function>
}

export default Vue.extend({
  name: 'NewSeriesPlaylistDialog',
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
      seriesId: '',
      seriesIdRules: [(v: string) => !!v || 'シリーズIDを入力してください'],
    }
  },
  methods: {
    submitNewSeriesPlaylist() {
      const form: any = this.$refs.form
      form.validate()

      if (this.valid) {
        this.loadingDialog = true
        this.$store.dispatch('playlists/createPlaylistFromSeries', {
          playlist: {
            original_series_id: this.seriesId,
          },
        })
        this.subscribeSubmitAction()
      }
    },
    subscribeSubmitAction() {
      this.$store.subscribeAction({
        after: (action, state) => {
          if (action.type !== 'playlists/createPlaylistFromSeries') return

          if (
            state.playlists.allItems[0].original_series_id === this.seriesId
          ) {
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
      this.seriesId = ''
      this.$emit('hide-new-series-playlist-dialog')
    },
    validate() {
      const form: any = this.$refs.form
      form.validate()
    },
  },
})
</script>
