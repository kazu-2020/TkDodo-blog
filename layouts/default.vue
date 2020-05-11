<template>
  <v-app dark>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-toolbar-title v-text="title" />
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="transparent" dark depressed v-on="on">
            <v-icon>mdi-playlist-play</v-icon>
            プレイリスト
          </v-btn>
        </template>
        <v-list>
          <v-list-item :to="'/'">
            <v-list-item-title>一覧</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <new-playlist-dialog />
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="transparent" dark depressed v-on="on">
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
      <v-spacer />
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

<script>
import NewPlaylistDialog from '../components/NewPlaylistDialog'

export default {
  components: {
    NewPlaylistDialog,
  },
  data() {
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
      ],
      miniVariant: true,
      right: false,
      rightDrawer: false,
      title: 'PLAYLIST（仮）',
      dialog: false,
    }
  },
}
</script>
