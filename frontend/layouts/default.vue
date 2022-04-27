<template>
  <v-app>
    <v-app-bar :clipped-left="clipped" fixed app color="white">
      <nuxt-link :to="'/'" style="text-decoration: none" class="playlist-title">
        <v-img
          src="/logo-black.jpg"
          srcset="/logo-black.jpg 1x, /logo-black@2x.jpg 2x"
          width="225"
          class="mr-5 ml-1"
        />
      </nuxt-link>
      <v-menu offset-y>
        <template #activator="{ on }">
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
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <template #activator="{ on }">
          <v-btn color="transparent" depressed tile height="64" v-on="on">
            <v-icon class="mr-3">mdi-table</v-icon>
            デッキ
          </v-btn>
        </template>
        <v-list>
          <v-list-item :to="'/decks'">
            <v-list-item-title>レコメンドデッキ一覧</v-list-item-title>
          </v-list-item>
          <v-list-item :to="'/decks/new'">
            <v-list-item-title>レコメンドデッキ新規作成</v-list-item-title>
          </v-list-item>
          <v-list-item :to="'/decks/viewer'">
            <v-list-item-title>レコメンドデッキビューア</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item :to="'/series_decks'">
            <v-list-item-title>シリーズデッキ一覧</v-list-item-title>
          </v-list-item>
          <v-list-item :to="'/series_decks/new'">
            <v-list-item-title>シリーズデッキ新規作成</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <new-playlist-dialog
        :is-show-dialog="isShowNewPlaylistDialog"
        @hide-new-playlist-dialog="isShowNewPlaylistDialog = false"
      />
    </v-app-bar>
    <v-main class="ivory-background">
      <v-container fluid class="px-10">
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :fixed="fixed" app padless>
      <v-card flat tile width="100%" class="text-center">
        <span v-if="isProd()"
          >&copy; {{ new Date().getFullYear() }} EditorialHands</span
        >
        <v-system-bar v-else color="yellow lighten-1" lights-out>
          <v-spacer />
          <v-icon>mdi-alert-circle-outline</v-icon>
          <span>こちらは {{ envName }} 環境です。</span>
          <a href="https://eh.nr.nhk.jp/" target="_blank">本番環境へ </a>
          <v-icon style="text-decoration: none" small>mdi-open-in-new</v-icon>
        </v-system-bar>
      </v-card>
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
import NewPlaylistDialog from '~/components/common/NewPlaylistDialog.vue'

interface DataType {
  clipped: boolean
  drawer: boolean
  fixed: boolean
  miniVariant: boolean
  right: boolean
  rightDrawer: boolean
  title: string
  isShowNewPlaylistDialog: boolean
  modeIcon: string
}

export default Vue.extend({
  name: 'LayoutDefault',
  components: {
    NewPlaylistDialog,
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
    envName(): string {
      return process.env.environment || 'development'
    },
  },
  methods: {
    resetLoadingState() {
      this.$store.dispatch('loading/resetLoadingState')
    },
    isProd() {
      return process.env.environment === 'production'
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

.v-main.ivory-background {
  background-color: #f0f0f0;
}
</style>
