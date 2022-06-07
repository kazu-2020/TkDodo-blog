<template>
  <div
    class="mx-auto pa-2 clearfix"
    style="background-color: white; border-radius: 4px; cursor: pointer"
    :style="`border-left: 3px solid ${primaryColor};`"
    outlined
    light
    @click="clickPlaylistItem"
  >
    <v-img
      :src="logoImageUrl"
      class="playlist_logo_image float-left mr-3 elevation-3"
      aspect-ratio="1"
      height="30"
      width="30"
    />
    <div class="title float-left">
      <a class="playlist-title">
        <span class="playlist-name">{{ playlistName }}</span>
        <api-state-badge class="" :playlist="playlist" />
      </a>
    </div>
    <div class="float-right mt-1 pr-4">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon>mdi-monitor</v-icon>
          <span v-bind="attrs" v-on="on">
            {{ playlist.itemNum }}
          </span>
        </template>
        <span>総エピソード数</span>
      </v-tooltip>
    </div>
    <div class="float-right mt-1 pr-4">
      <v-icon>mdi-update</v-icon>
      {{ lastUpdateDate }}
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import format from 'date-fns/format'
import ApiStateBadge from '~/components/playlists/ApiStateBadge.vue'
import DummyImageHelper from '~/utils/DummyImageHelper'

interface DataType {
  episodePreviewNum: number
}

export default Vue.extend({
  name: 'SimplePlaylistItem',
  components: {
    ApiStateBadge,
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
    logoImageUrl(): string {
      return (
        this.playlist.logo?.medium?.url ||
        DummyImageHelper.getPath(this.playlist.dateCreated, 'logo')
      )
    },
    lastUpdateDate(): string {
      return this.formattedDate(this.playlist.dateModified)
    },
    primaryColor(): string {
      return this.playlist.style.primaryLight
    },
  },
  methods: {
    formattedDate(_time: string): string {
      return format(new Date(_time), 'yyyy/MM/dd HH:mm')
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
