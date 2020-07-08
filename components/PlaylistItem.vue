<template>
  <v-card class="mb-4" outlined light>
    <v-list-item three-line>
      <v-list-item-avatar tile size="140" horizontal>
        <v-img :src="dummyImage" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">
          {{ playlist.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          番組数:
          <span>{{ playlist.episodeNum }}件</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          公開期間:
          <span>2020/01/02 ~ 2021/10/02</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          番組総時間:
          <span>{{ totalTime }}</span>
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-icon>mdi-update</v-icon>
          {{ formattedDate(playlist.updated_at) }}
          更新
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-card-actions>
        <v-btn
          outlined
          x-small
          :to="{ name: 'playlists-id', params: { id: playlist.id } }"
          nuxt
        >
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
        <v-btn outlined x-small @click="deletePlaylist">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </v-card-actions>
    </v-list-item>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

export default Vue.extend({
  name: 'PlaylistItem',
  props: {
    playlist: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  computed: {
    dummyImage() {
      const logoNumber =
        Number(moment(this.playlist.dateCreated).format('SS')) % 11
      return `/dummy/default${logoNumber}/default${logoNumber}-logo.png`
    },
    totalTime() {
      const seconds = this.playlist.totalTime % 60
      const totalMinutes = (this.playlist.totalTime - seconds) / 60
      const minutes = totalMinutes % 60
      const hours = totalMinutes / 60

      return `${('00' + hours).slice(-2)}:${('00' + minutes).slice(-2)}:${(
        '00' + seconds
      ).slice(-2)}`
    },
  },
  methods: {
    formattedDate(_time: string) {
      return moment(_time).format('YYYY/MM/DD')
    },
    deletePlaylist() {
      if (confirm('本当に削除しますか？')) {
        this.$emit('delete-playlist', this.playlist)
      }
    },
  },
})
</script>
<style scoped>
.v-list-item {
  position: relative;
}

.v-card__actions {
  position: absolute;
  top: 0;
  right: 0;
}

.v-btn:not(.v-btn--round).v-size--x-small {
  min-width: 0;
  width: 35px;
  height: 35px;
}

.v-application--is-ltr
  .v-list-item__avatar.v-list-item__avatar--horizontal:first-child {
  margin-top: 0px;
  margin-left: -16px;
  margin-bottom: 0;
}

.v-avatar.v-list-item__avatar.v-list-item__avatar--horizontal.v-avatar--tile.grey {
  border-top-left-radius: 3px;
  -webkit-border-top-left-radius: 3px;
  -moz-border-radius-topleft: 3px;
  border-bottom-left-radius: 3px;
  -webkit-border-bottom-left-radius: 3px;
  -moz-border-radius-bottomleft: 3px;
}
</style>
