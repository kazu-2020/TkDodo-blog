<template>
  <v-dialog v-model="dialog" scrollable width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn :color="buttonColor" icon small v-bind="attrs" v-on="on">
        <v-icon>mdi-code-json</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ `/pl/${playlist.id}.json 出力イメージ` }}
        </span>
      </v-card-title>
      <v-card-text>
        {{ playlistJson }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">
          閉じる
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
  dialog: boolean
  playlistJson: Object
}

export default Vue.extend({
  name: 'PlaylistJsonDialog',
  props: {
    buttonColor: {
      type: String,
      required: true,
      default: '#FFFFFF',
    },
    playlist: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      dialog: false,
      playlistJson: '',
    }
  },
  watch: {
    dialog: {
      handler(newValue) {
        if (newValue && this.playlistJson === '') {
          this.$axios.get(`/api/playlists/${this.playlist.id}`).then((res) => {
            this.playlistJson = JSON.stringify(res.data.playlist, null, 4)
          })
        }
      },
    },
  },
})
</script>
