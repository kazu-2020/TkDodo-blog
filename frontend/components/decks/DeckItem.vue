<template>
  <v-card flat>
    <v-row class="mx-1 mt-1">
      <v-col cols="auto" class="mr-auto">
        <v-icon>mdi-clock-time-four-outline</v-icon>
        <span class="body-2 mr-2" style="color: rgba(0, 0, 0, 0.54)">
          プレイリスト時間数: {{ totalTime }}
        </span>
        <v-icon>mdi-monitor</v-icon>
        <span class="body-2 mr-2" style="color: rgba(0, 0, 0, 0.54)">
          プレイリスト数: {{ deck.playlistCount }}
        </span>
        <v-icon>mdi-update</v-icon>
        <span class="body-2 mr-2" style="color: rgba(0, 0, 0, 0.54)">
          {{ lastUpdateDate }} 更新
        </span>
        <v-chip outlined label small>東京</v-chip>
      </v-col>
      <v-col cols="auto">
        <v-btn
          class="delete_button mr-2"
          outlined
          @click="deleteSelectedDeck(deck.id)"
        >
          <v-icon left>mdi-delete</v-icon>
          削除する
        </v-btn>
        <v-btn
          :to="{
            name: 'decks-id',
            params: { id: deck.id },
          }"
          nuxt
          depressed
          color="orange"
          class="edit_button"
        >
          <v-icon left>mdi-pencil</v-icon>
          編集する
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="playlists.length === 0" align="center" class="height-100">
      <v-container fill-height fluid>
        <v-row v-if="isError" align="center" justify="center"
          ><v-col class="body-2">エラーが発生しました</v-col></v-row
        >
        <v-row v-else-if="isFetched" align="center" justify="center"
          ><v-col class="body-2">エピソードはありません</v-col></v-row
        >
        <v-row v-else align="center" justify="center"
          ><v-col><v-progress-circular indeterminate color="amber" /></v-col
        ></v-row>
      </v-container>
    </v-row>
    <v-row v-else class="mx-2 mb-2" dense>
      <v-col
        v-for="playlist in playlists"
        :key="`${playlist.id}-deck-item`"
        cols="1"
      >
        <deck-playlist-list-item :playlist="playlist" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import { Playlist } from '~/types/playlist'
import DeckPlaylistListItem from '~/components/decks/DeckPlaylistListItem.vue'

interface DataType {
  playlists: Playlist[]
  isError: boolean
  isFetched: boolean
}

export default Vue.extend({
  components: {
    DeckPlaylistListItem,
  },
  props: {
    deck: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      playlists: [],
      isError: false,
      isFetched: false,
    }
  },
  computed: {
    totalTime(): string {
      if (!this.deck.totalTime) {
        return '--:--:--'
      }
      const seconds = this.deck.totalTime % 60
      const totalMinutes = (this.deck.totalTime - seconds) / 60
      const minutes = totalMinutes % 60
      const hours = Math.floor(totalMinutes / 60)

      return `${('00' + hours).slice(-2)}:${('00' + minutes).slice(-2)}:${(
        '00' + seconds
      ).slice(-2)}`
    },
    lastUpdateDate(): string {
      return this.formattedDate(this.deck.dateModified)
    },
  },
  mounted() {
    this.fetchPlaylists()
  },
  methods: {
    formattedDate(_time: string): string {
      return moment(_time).format('YYYY/MM/DD HH:mm')
    },
    fetchPlaylists() {
      if (this.playlists.length !== 0) return

      this.$axios
        .get(`/playlists?deck_id=${this.deck.id}&per=12`)
        .then((res) => {
          this.playlists = res.data.playlists
        })
        .catch(() => {
          this.isError = true
        })
        .finally(() => {
          this.isFetched = true
        })
    },
  },
})
</script>

<style scoped>
.edit_button {
  color: white;
}

.delete_button {
  color: #4f4f4f;
}
</style>
