<template>
  <v-card class="mx-auto" outlined light>
    <v-container>
      <v-row class="px-4">
        <v-col class="playlist_logo_block py-0" @click="clickPlaylistItem">
          <v-row class="pa-4">
            <v-col cols="3" class="pa-0 pl-1 pb-1 mt-1">
              <v-img
                :src="logoImageUrl"
                class="playlist_logo_image"
                aspect-ratio="1"
              />
            </v-col>
            <v-col class="mr-auto pl-1" cols="9">
              <v-card-title class="title mb-1">
                <a class="playlist-title">
                  <span class="playlist-name">{{ playlist.name }}</span>
                  <api-state-badge class="ma-2" :playlist="playlist" />
                </a>
              </v-card-title>
              <v-card-text class="card-list-item pb-1">
                <div class="last_updated_at d-inline">
                  <v-icon>mdi-update</v-icon>
                  {{ lastUpdateDate }} 更新
                </div>
                <div class="episodes_count d-inline ml-5">
                  <v-icon>mdi-monitor</v-icon>
                  エピソード数： {{ playlist.itemNum }}
                </div>
              </v-card-text>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="hidden-md-and-down pa-0" cols="6">
          <playlist-episodes-carousel :playlist="playlist" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
import format from 'date-fns/format'
import PlaylistEpisodesCarousel from '~/components/common/PlaylistEpisodesCarousel.vue'
import ApiStateBadge from '~/components/playlists/ApiStateBadge.vue'
import DummyImageHelper from '~/utils/DummyImageHelper'

interface DataType {
  episodePreviewNum: number
}

export default Vue.extend({
  name: 'PlaylistItem',
  components: {
    PlaylistEpisodesCarousel,
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
    logoImageUrl(): string {
      return (
        this.playlist.logo?.medium?.url ||
        DummyImageHelper.getPath(this.playlist.dateCreated, 'logo')
      )
    },
    lastUpdateDate(): string {
      return this.formattedDate(this.playlist.dateModified)
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
.col.col-auto,
.col.mr-auto {
  padding: 0px 16px;
}

.v-card__title.title {
  padding-top: 0;
  padding-bottom: 0;
}

.playlist-title .playlist-name {
  text-decoration: underline;
}

.v-card__text.card-list-item {
  padding-top: 0;
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
</style>
