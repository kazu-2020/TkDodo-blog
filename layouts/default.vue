<template>
  <v-app>
    <v-app-bar :clipped-left="clipped" fixed app>
      <nuxt-link :to="'/'" style="text-decoration: none;" class="white--text">
        <v-toolbar-title v-text="title" />
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
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
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
          title: 'Sandbox(アウトライン型)',
          to: '/playlisticles/sandbox2',
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
      title: 'PLAYLIST（仮）',
      isShowNewPlaylistDialog: false,
      modeIcon: 'mdi-brightness-7',
    }
  },
  computed: {
    vuetify(): any {
      // FIXME: 型定義してあげたい
      return (this as any).$vuetify
    },
  },
  beforeMount() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const darkModeOn = darkModeMediaQuery.matches

    this.vuetify.theme.dark = darkModeOn
    this.setModeIcon(darkModeOn)
  },
  methods: {
    toggleDarkMode() {
      this.vuetify.theme.dark = !this.vuetify.theme.dark
      this.setModeIcon(this.vuetify.theme.dark)
    },
    setModeIcon(isDark: boolean) {
      if (isDark) {
        this.modeIcon = 'mdi-brightness-2'
      } else {
        this.modeIcon = 'mdi-brightness-7'
      }
    },
  },
})
</script>

<style scoped>
.playlist_new {
  cursor: pointer;
}
</style>
