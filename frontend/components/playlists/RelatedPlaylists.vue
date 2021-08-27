<template>
  <div :class="relatedPlaylistKlass">
    <h4 class="mb-2">似ているプレイリスト</h4>
    <v-row class="mb-2">
      <v-col v-for="playlist in relatedPlaylists" :key="playlist.id" cols="2">
        <a :href="externalPlaylistUrl(playlist)" target="_blank">
          <v-img
            :src="playlist.logo.medium.url"
            :alt="playlist.name"
            max-width="120"
            class="mb-1"
            lazy-src="https://placehold.jp/3d4070/ffffff/120x120.png?text=NoImage"
          />
          <div class="body-2" style="max-width: 120px">
            {{ playlist.name }}
          </div>
        </a>
      </v-col>
    </v-row>
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
      const extractedKeyword = /^「(.+)」/.exec(playlist.name) || []

      switch (playlist.identifierGroup.typeOfList) {
        case 'search':
          if (extractedKeyword.length > 1) {
            return `https://dev-www-eh.nr.nhk.jp/search/${extractedKeyword[1]}`
          } else {
            return 'https://dev-www-eh.nr.nhk.jp'
          }
        case 'series':
          return `https://dev-www-eh.nr.nhk.jp/p/pl/${playlist.id}/series`
        default:
          return `https://dev-www-eh.nr.nhk.jp/p/pl/${playlist.id}`
      }
    },
  },
})
</script>
