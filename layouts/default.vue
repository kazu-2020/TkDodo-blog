<template>
  <v-app dark>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-toolbar-title v-text="title" />
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="transparent" dark depressed="false" v-on="on">
            <v-icon>mdi-playlist-play</v-icon>
            プレイリスト
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in playlistItems"
            :key="index"
            :to="item.to"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        color="transparent"
        dark
        depressed="false"
        to="/user_needs"
        v-on="on"
      >
        ユーザーニーズ
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="transparent" dark depressed="false" v-on="on">
            <v-icon>mdi-view-grid</v-icon>
            デッキ
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in deckItems"
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
export default {
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      playlistItems: [
        {
          title: '一覧',
          to: '/playlists',
        },
        {
          title: '新規作成',
          to: '/playlists/new',
        },
      ],
      deckItems: [
        {
          title: '一覧',
          to: '/decks',
        },
        {
          title: '新規作成',
          to: '/decks/new',
        },
      ],
      miniVariant: true,
      right: false,
      rightDrawer: false,
      title: 'PLAYLIST（仮）',
    }
  },
}
</script>
