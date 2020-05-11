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
              <v-text-field label="プレイリスト名 - Name" required />
              <v-text-field
                label="ふりがな - Detailed Series Name Ruby"
                required
              />
              <v-textarea label="説明 - Description" auto-grow />
            </v-col>
          </v-row>
          <v-row justify="center" align-content="center">
            <v-col cols="5">
              <v-btn depressed color="orange" large>
                この内容で新規作成する
              </v-btn>
              <small>* 内容は後で変更できます</small>
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
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    }
  },
}
</script>

<style scoped>
.playlist_new {
  cursor: pointer;
}
</style>
