<template>
  <v-card class="mx-auto" outlined light>
    <v-container>
      <v-row>
        <v-col class="py-0 pr-0 pl-4 playlist_logo_block">
          <v-row>
            <v-col cols="2" class="pt-2 pb-0 pr-0">
              <v-img
                :src="logoImageUrl"
                class="playlist_logo_image"
                aspect-ratio="1"
              />
            </v-col>
            <v-col class="mr-auto" cols="10">
              <v-card-title class="title mb-1 playlist-title">
                {{ playlist.name }}
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
        <v-col cols="auto" class="text-center pl-0 pt-0">
          <v-row class="flex-column ma-0 fill-height">
            <v-col class="px-0 pt-0">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
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
            </v-col>
            <v-col class="px-0 pt-0">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    icon
                    v-bind="attrs"
                    class="delete_button"
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
      return this.formattedDate(this.playlist.updated_at)
    },
  },
  methods: {
    formattedDate(_time: string): string {
      return moment(_time).format('YYYY/MM/DD')
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
}
</style>
