<template>
  <div :class="relatedPlaylistKlass">
    <h4 class="mb-2">似ているプレイリスト</h4>
    <div class="d-flex flex-wrap mb-5">
      <v-card
        v-for="playlist in relatedPlaylists"
        :key="playlist.id"
        outlined
        rounded
        class="mr-1 mb-1"
        style="height: 32px; overflow: hidden"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import qs from 'qs'

interface DataType {
  relatedPlaylists: object[]
}

export default Vue.extend({
  name: 'RelatedPlaylists',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    keywords: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data(): DataType {
    return {
      relatedPlaylists: [],
    }
  },
  computed: {
    relatedPlaylistKlass(): string {
      if (this.relatedPlaylists.length === 0) {
        return 'd-none'
      } else {
        return ''
      }
    },
    episodeIds(): string[] {
      return this.items.map((item: any) => item.id)
    },
  },
  watch: {
    keywords: {
      async handler() {
        await this.fetchRelatedPlaylists()
      },
    },
    items: {
      async handler() {
        await this.fetchRelatedPlaylists()
      },
    },
  },
  async mounted() {
    await this.fetchRelatedPlaylists()
  },
  methods: {
    fetchRelatedPlaylists(): void {
      this.$axios
        .get(`/related_playlists`, {
          params: { episode_ids: this.episodeIds, keywords: this.keywords },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: 'comma' })
          },
        })
        .then((res) => {
          console.log(res)
          this.relatedPlaylists = res.data.playlists
        })
    },
    externalPlaylistUrl(playlist: any): string {
      switch (playlist.identifierGroup.typeOfList) {
        case 'series':
          return `https://dev-www-eh.nr.nhk.jp/p/pl/${playlist.id}/series`
        default:
          return `https://dev-www-eh.nr.nhk.jp/p/pl/${playlist.id}`
      }
    },
  },
})
</script>
