<template>
  <v-card class="mx-auto" outlined light>
    <v-container>
      <v-row class="px-4">
        <v-col class="playlist_logo_block py-0">
          <v-row>
            <v-col cols="3" class="pa-0 pl-1 pb-1 mt-1">
              <v-img
                :src="logoImageUrl"
                class="playlist_logo_image"
                aspect-ratio="1"
              />
            </v-col>
            <v-col class="mr-auto pl-1" cols="9">
              <v-card-title class="title mb-1">
                <nuxt-link
                  :to="{ name: 'playlists-id', params: { id: playlist.id } }"
                  class="playlist-title"
                >
                  {{ playlist.name }}
                </nuxt-link>
                <v-chip class="ma-2" small>下書き</v-chip>
              </v-card-title>
              <v-card-text class="card-list-item pb-1">
                番組総時間:
                <span>{{ totalTime }}</span>
              </v-card-text>
              <v-card-text class="card-list-item pb-1">
                <v-icon>mdi-update</v-icon>
                {{ lastUpdateDate }} 更新
              </v-card-text>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="hidden-md-and-down pa-0" cols="6">
          <playlist-episodes-carousel :playlist="playlist" />
        </v-col>
        <v-col cols="auto" class="text-center px-0 pt-0">
          <v-row class="flex-column ma-0 fill-height">
            <v-col class="px-0 pt-0">
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-btn
                    small
                    icon
                    v-bind="attrs"
                    :to="{ name: 'playlists-id', params: { id: playlist.id } }"
                    nuxt
                    v-on="on"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>編集する</span>
              </v-tooltip>
              <br />
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    small
                    icon
                    v-bind="attrs"
                    class="delete_button mt-2"
                    v-on="on"
                    @click="deletePlaylist"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>削除する</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import PlaylistEpisodesCarousel from '~/components/common/PlaylistEpisodesCarousel.vue'

interface DataType {
  episodePreviewNum: number
}

export default Vue.extend({
  name: 'PlaylistItem',
  components: {
    PlaylistEpisodesCarousel,
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
    deletePlaylist(): void {
      if (confirm('本当に削除しますか？')) {
        this.$emit('delete-playlist', this.playlist)
      }
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

.v-card__text.card-list-item {
  padding-top: 0;
}

.playlist_logo_block {
  width: 30%;
}

.playlist_logo_image {
  width: 100%;
  border-radius: 4px;
}
</style>
