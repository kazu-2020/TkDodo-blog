<template>
  <div>
    <div>
      <v-card
        outlined
        rounded
        class="mr-1 mb-1"
        style="height: 32px"
        @mouseover="showPopOver = true"
        @mouseleave="showPopOver = false"
      >
        <a
          :href="externalPlaylistUrl(playlist)"
          target="_blank"
          class="text-decoration-none"
        >
          <v-img
            :src="playlist.logo.medium.url"
            :alt="playlist.name"
            max-width="30"
            class="mb-1 d-inline-block"
            lazy-src="https://placehold.jp/3d4070/ffffff/120x120.png?text=NoImage"
          />
          <span class="body-2 pl-1 pr-2" style="position: relative; top: -13px">
            {{ playlist.name }}
          </span>
        </a>
      </v-card>
    </div>
    <div style="position: absolute">
      <v-scroll-y-transition>
        <v-card
          v-show="showPopOver"
          class="mx-auto"
          style="z-index: 10"
          @mouseover="showPopOver = true"
          @mouseleave="showPopOver = false"
        >
          <v-card-text>
            <div class="text--primary">
              {{ playlistDescription }}
            </div>
            <div v-show="itemCount !== undefined" class="text--primary mt-2">
              <div v-if="itemCount === 0">エピソードなし</div>
              <div v-else>{{ itemCount }}つのエピソード</div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" @click="openPreviewPage"
              >詳しく見る</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-scroll-y-transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
  showPopOver: boolean
  itemCount: number | undefined
}

export default Vue.extend({
  name: 'RelatedPlaylist',
  props: {
    playlist: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      showPopOver: false,
      itemCount: undefined,
    }
  },
  computed: {
    playlistDescription(): string {
      return this.playlist.description || '(説明なし)'
    },
  },
  watch: {
    showPopOver: {
      async handler(newVal: boolean) {
        if (newVal && this.itemCount === undefined) {
          await this.fetchEpisodeItems(this.playlist.url)
        }
      },
      immediate: true,
    },
  },
  methods: {
    externalPlaylistUrl(playlist: any): string {
      switch (playlist.identifierGroup.typeOfList) {
        case 'series':
          return `https://dev-www-eh.nr.nhk.jp/p/pl/${playlist.id}/series`
        default:
          return `https://dev-www-eh.nr.nhk.jp/p/pl/${playlist.id}`
      }
    },
    openPreviewPage(): void {
      window.open(this.externalPlaylistUrl(this.playlist), '_blank')
    },
    fetchEpisodeItems(url: string) {
      this.$axios.get(url).then((res) => {
        const itemUrl = res.data.itemUrl
        this.$axios.get(itemUrl).then((res2) => {
          this.itemCount = res2.data.count
        })
      })
    },
  },
})
</script>
