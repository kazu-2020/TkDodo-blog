<template>
  <div :class="relatedPlaylistKlass">
    <h4 class="mb-2">似ているプレイリスト</h4>
    <div class="d-flex flex-wrap mb-5">
      <related-playlist
        v-for="playlist in relatedPlaylists"
        :key="playlist.playlistUId"
        :playlist="playlist"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import qs from 'qs'
import RelatedPlaylist from '~/components/playlists/RelatedPlaylist.vue'

interface DataType {
  relatedPlaylists: object[]
}

export default Vue.extend({
  name: 'RelatedPlaylists',
  components: {
    RelatedPlaylist,
  },
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
          this.relatedPlaylists = res.data.playlists
        })
    },
    externalPlaylistUrl(playlist: any): string {
      switch (playlist.identifierGroup.typeOfList) {
        case 'series':
          return `https://dev-www-eh.nr.nhk.jp/p/pl/${playlist.stringId}/series`
        default:
          return `https://dev-www-eh.nr.nhk.jp/p/pl/${playlist.stringId}`
      }
    },
  },
})
</script>
