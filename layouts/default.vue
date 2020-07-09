<template>
  <v-app>
    <v-app-bar :clipped-left="clipped" fixed app>
      <nuxt-link
        :to="'/'"
        style="text-decoration: none;"
        class="playlist-title"
      >
        <v-img
          src="logo.png"
          srcset="logo.png 1x, logo@2x.png 2x"
          width="150"
        />
      </nuxt-link>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="transparent" depressed v-on="on">
            <v-icon>mdi-playlist-play</v-icon>
            プレイリスト
          </v-btn>
        </template>
        <v-list>
          <v-list-item :to="'/'">
            <v-list-item-title>一覧</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              class="playlist_new"
              @click="isShowNewPlaylistDialog = true"
            >
              新規作成
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="transparent" depressed v-on="on">
            <v-icon>mdi-view-grid</v-icon>
            プレイリスティクル
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in playlisticleItems"
            :key="index"
            :to="item.to"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <new-playlist-dialog
        :is-show-dialog="isShowNewPlaylistDialog"
        @hide-new-playlist-dialog="isShowNewPlaylistDialog = false"
      />
      <v-spacer />
      <v-btn @click="toggleDarkMode">
        <v-icon>{{ modeIcon }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
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

interface DataType {
  clipped: boolean
  drawer: boolean
  fixed: boolean
  playlisticleItems: Array<object>
  miniVariant: boolean
  right: boolean
  rightDrawer: boolean
  title: string
  isShowNewPlaylistDialog: boolean
  modeIcon: string
}

export default Vue.extend({
  name: 'LayoutDefault',
  components: { NewPlaylistDialog },
  data(): DataType {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      playlisticleItems: [
        {
          title: '一覧',
          to: '/playlisticles',
        },
        {
          title: '新規作成',
          to: '/playlisticles/new',
        },
        {
          title: 'Sandbox(Word風)',
          to: '/playlisticles/sandbox',
        },
        {
          title: 'Sandbox(記事単体)',
          to: '/playlisticles/sandbox3',
        },
        {
          title: 'メタ入力フォーム',
          to: '/playlisticles/meta',
        },
      ],
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
    cookies(): any {
      // FIXME: 型定義してあげたい
      return (this as any).$cookies
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
  beforeMount() {
    let darkModeOn: boolean = false

    if (this.cookies.get('isDarkMode') !== undefined) {
      darkModeOn = this.cookies.get('isDarkMode') === 'true'
    } else {
      const darkModeMediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)'
      )
      darkModeOn = darkModeMediaQuery.matches
    }

    this.vuetify.theme.dark = darkModeOn
    this.setModeIcon(darkModeOn)
  },
  methods: {
    toggleDarkMode() {
      this.vuetify.theme.dark = !this.vuetify.theme.dark
      this.setModeIcon(this.vuetify.theme.dark)

      this.cookies.set('isDarkMode', this.vuetify.theme.dark, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
    },
    setModeIcon(isDark: boolean) {
      if (isDark) {
        this.modeIcon = 'mdi-brightness-2'
      } else {
        this.modeIcon = 'mdi-brightness-7'
      }
    },
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

  .theme--dark & {
    color: white;
  }
}
</style>
