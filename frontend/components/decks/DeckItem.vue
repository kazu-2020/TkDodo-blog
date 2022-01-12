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
    <v-row class="mx-2 mb-2">
      <v-col cols="2">プレイリスト名が入ります。プレイリスト名が入ります</v-col>
      <v-col cols="2">
        プレイリスト名が入ります。プレイリスト名が入ります</v-col
      >
      <v-col cols="2">
        プレイリスト名が入ります。プレイリスト名が入ります</v-col
      >
      <v-col cols="2">
        プレイリスト名が入ります。プレイリスト名が入ります</v-col
      >
      <v-col cols="2">
        プレイリスト名が入ります。プレイリスト名が入ります</v-col
      >
      <v-col cols="2">
        プレイリスト名が入ります。プレイリスト名が入ります
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

export default Vue.extend({
  props: {
    deck: {
      type: Object,
      required: true,
      default: () => {},
    },
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
  methods: {
    formattedDate(_time: string): string {
      return moment(_time).format('YYYY/MM/DD HH:mm')
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
