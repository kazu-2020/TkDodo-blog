<template>
  <v-dialog v-model="dialog" scrollable width="600px">
    <template #activator="{ on, attrs }">
      <v-btn
        :color="buttonColor"
        icon
        small
        v-bind="attrs"
        class="dialog_button"
        v-on="on"
      >
        <v-icon>mdi-code-json</v-icon>
      </v-btn>
    </template>
    <v-card class="playlist_json_dialog">
      <v-card-title>
        <span class="headline">
          {{ `/d6.6/t/nplaylist/id/${playlistId}.json 出力イメージ` }}
        </span>
      </v-card-title>
      <v-card-text>
        <div v-if="playlistJson === null">読込中...</div>
        <vue-json-pretty v-else :data="playlistJson" show-length :deep="1" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false"> 閉じる </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="js">
import Vue from 'vue'

export default Vue.extend({
  name: 'PlaylistJsonDialog',
  props: {
    buttonColor: {
      type: String,
      required: false,
      default: '#FFFFFF',
    },
    playlistId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      playlistJson: null,
    }
  },
  watch: {
    dialog: {
      handler(newValue) {
        if (newValue && this.playlistJson === null) {
          this.$axios.get(`/d6.6/t/nplaylist/id/${this.playlistId}`).then((res) => {
            this.playlistJson = res.data
          })
        }
      },
    },
  },
})
</script>
