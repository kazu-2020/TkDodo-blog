<template>
  <v-app>
    <v-app-bar :clipped-left="clipped" fixed app>
      <nuxt-link :to="'/'" style="text-decoration: none" class="playlist-title">
        <v-img
          src="/logo-black.png"
          srcset="/logo-black.png 1x, /logo-black@2x.png 2x"
          width="150"
          class="mr-5 ml-1"
        />
      </nuxt-link>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="transparent" depressed tile height="64" v-on="on">
            <v-icon class="mr-3">mdi-playlist-play</v-icon>
            プレイリスト
          </v-btn>
        </template>
        <v-list>
          <v-list-item :to="'/'">
            <v-list-item-title>一覧</v-list-item-title>
          </v-list-item>
          <v-list-item @click="isShowNewPlaylistDialog = true">
            <v-list-item-title class="playlist_new">
              新規作成
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="isShowNewSeriesPlaylistDialog = true">
            <v-list-item-title> シリーズプレイリスト作成 </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="transparent" depressed tile height="64" v-on="on">
            <v-icon class="mr-3">mdi-access-point</v-icon>
            r5 プレイリスト
          </v-btn>
        </template>
        <v-list>
          <v-list-item :to="'/playlists/tokyo'">
            <v-list-item-title>東京</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <new-playlist-dialog
        :is-show-dialog="isShowNewPlaylistDialog"
        @hide-new-playlist-dialog="isShowNewPlaylistDialog = false"
      />
      <new-series-playlist-dialog
        :is-show-dialog="isShowNewSeriesPlaylistDialog"
        @hide-new-series-playlist-dialog="isShowNewSeriesPlaylistDialog = false"
      />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} EditorialHands</span>
    </v-footer>
    <v-dialog v-model="loading" hide-overlay persistent width="300">
      <v-card>
        <v-card-text class="pt-2">
          送信中...
          <v-progress-linear indeterminate class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="loadingResultSnackBar"
      :color="snackBarState"
      right
      top
      timeout="5000"
    >
      <v-row justify="space-between">
        <v-col cols="auto" class="pa-2">
          {{ snackBarMessage }}
        </v-col>
        <v-col cols="auto" class="pa-0">
          <v-btn color="white" text @click="resetLoadingState">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import NewPlaylistDialog from '~/components/NewPlaylistDialog.vue'
import NewSeriesPlaylistDialog from '~/components/NewSeriesPlaylistDialog.vue'

interface DataType {
  clipped: boolean
  drawer: boolean
  fixed: boolean
  miniVariant: boolean
  right: boolean
  rightDrawer: boolean
  title: string
  isShowNewPlaylistDialog: boolean
  isShowNewSeriesPlaylistDialog: boolean
  modeIcon: string
}

export default Vue.extend({
  name: 'LayoutDefault',
  components: {
    NewPlaylistDialog,
    NewSeriesPlaylistDialog,
  },
  data(): DataType {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      miniVariant: true,
      right: false,
      rightDrawer: false,
      title: 'EditorialHands',
      isShowNewPlaylistDialog: false,
      isShowNewSeriesPlaylistDialog: false,
      modeIcon: 'mdi-brightness-7',
    }
  },
  computed: {
    vuetify(): any {
      // FIXME: 型定義してあげたい
      return (this as any).$vuetify
    },
    loading(): boolean {
      return this.$store.state.loading.state === 'loading'
    },
    loadingResultSnackBar: {
      get(): boolean {
        const loadingState = this.$store.state.loading.state
        return loadingState === 'success' || loadingState === 'error'
      },
      set(): void {
        this.$store.dispatch('loading/resetLoadingState')
      },
    },
    snackBarState(): string {
      return this.$store.state.loading.state
    },
    snackBarMessage(): string {
      return this.$store.state.loading.messages[this.snackBarState]
    },
  },
  methods: {
    resetLoadingState() {
      this.$store.dispatch('loading/resetLoadingState')
    },
  },
})
</script>

<style scoped lang="scss">
.playlist_new {
  cursor: pointer;
}

a.playlist-title {
  color: rgba(0, 0, 0, 0.87);
}
</style>
