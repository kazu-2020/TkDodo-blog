<template>
  <div
    class="mx-auto pa-2 clearfix"
    style="background-color: white; border-radius: 4px; cursor: pointer"
    outlined
    light
    @click="clickPlaylistItem"
  >
    <v-img
      :src="logoImageUrl"
      class="playlist_logo_image float-left mr-3"
      aspect-ratio="1"
      height="30"
      width="30"
    />
    <div class="title float-left">
      <a class="playlist-title">
        <span class="playlist-name">{{ playlistName }}</span>
        <published-state-badge class="" :playlist="playlist" />
        <span
          v-if="playlist.browsableItemCount === 0"
          style="font-size: 12px; color: black"
        >
          <v-icon>mdi-video-off-outline</v-icon>
        </span>
      </a>
    </div>
    <div class="float-right mt-1 pr-4">
      <v-icon>mdi-clock-time-four-outline</v-icon>
      {{ totalTime }}
    </div>
    <div class="float-right mt-1 pr-4">
      <v-icon>mdi-monitor</v-icon>
      {{ playlist.itemNum }}
    </div>
    <div class="float-right mt-1 pr-4">
      <v-icon>mdi-update</v-icon>
      {{ lastUpdateDate }} 更新
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import PublishedStateBadge from '~/components/playlists/PublishedStateBadge.vue'

interface DataType {
  episodePreviewNum: number
}

export default Vue.extend({
  name: 'SimplePlaylistItem',
  components: {
    PublishedStateBadge,
  },
  props: {
    playlist: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data(): DataType {
    return {
      episodePreviewNum: 6,
    }
  },
  computed: {
    playlistName(): string {
      const name = this.playlist.name || ''
      return name.length > 26 ? name.substr(0, 26) + '…' : name
    },
    totalTime(): string {
      if (!this.playlist.totalTime) {
        return '--:--:--'
      }
      const seconds = this.playlist.totalTime % 60
      const totalMinutes = (this.playlist.totalTime - seconds) / 60
      const minutes = totalMinutes % 60
      const hours = Math.floor(totalMinutes / 60)

      return `${('00' + hours).slice(-2)}:${('00' + minutes).slice(-2)}:${(
        '00' + seconds
      ).slice(-2)}`
    },
    logoImageUrl(): string {
      return this.playlist.logo?.medium?.url || this.dummyImage
    },
    dummyImage(): string {
      const logoNumber = this.playlist.dateCreated
        ? (Number(moment(this.playlist.dateCreated).format('DD')) % 10) + 1
        : 1
      return `/dummy/default${logoNumber}/default${logoNumber}-logo.png`
    },
    lastUpdateDate(): string {
      return this.formattedDate(this.playlist.dateModified)
    },
  },
  methods: {
    formattedDate(_time: string): string {
      return moment(_time).format('YYYY/MM/DD HH:mm')
    },
    clickPlaylistItem(): void {
      this.$emit('click-playlist-item', this.playlist)
    },
  },
})
</script>
<style scoped>
.playlist-title .playlist-name {
  font-size: 18px;
  font-weight: bold;
  line-height: 1.7rem;
}

.playlist_logo_block {
  width: 30%;
  cursor: pointer;
}

.playlist_logo_image {
  width: 100%;
  border-radius: 4px;
}

.last_updated_at,
.episodes_count {
  color: #4f4f4f;
}

.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
</style>
