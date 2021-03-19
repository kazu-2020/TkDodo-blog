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
      class="playlist_logo_image elevation-3 elevation-3 float-left"
      aspect-ratio="1"
      style="width: 160px"
    />
    <div class="title float-left ml-6 article-info">
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
      <div
        v-if="isArticlePresent"
        class="article_outline hidden-sm-and-down pl-0"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p style="text-align: start" class="body-1" v-html="articleOutline" />
      </div>
      <div v-else>
        <div class="no_article">
          <p class="no_article_text body-1">記事はまだありません</p>
        </div>
      </div>
      <div
        class="pt-2 pb-1 d-block pl-0 body-1"
        style="position: absolute; bottom: 0"
      >
        <div class="last_updated_at d-inline">
          <v-icon>mdi-update</v-icon>
          {{ lastUpdateDate }}
        </div>
        <div class="episodes_count d-inline ml-5">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-icon>mdi-monitor</v-icon>
              <span v-bind="attrs" v-on="on">
                {{ playlist.playableItemNum }} /
                {{ playlist.itemNum }}
              </span>
            </template>
            <span>再生可能エピソード数 / 総エピソード数</span>
          </v-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import PublishedStateBadge from '~/components/playlists/PublishedStateBadge.vue'

export default Vue.extend({
  name: 'ArticleItem',
  components: {
    PublishedStateBadge,
  },
  props: {
    playlist: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  computed: {
    logoImageUrl(): string {
      return this.playlist.logo?.medium?.url || this.dummyImage
    },
    dummyImage(): string {
      const logoNumber = this.playlist.dateCreated
        ? (Number(moment(this.playlist.dateCreated).format('DD')) % 10) + 1
        : 1
      return `/dummy/default${logoNumber}/default${logoNumber}-logo.png`
    },
    articleDetail(): string {
      const markedHeader = this.playlist.article.header || ''
      const markedBody = this.playlist.article.markedBody || ''
      const markedFooter = this.playlist.article.footer || ''

      return markedHeader + markedBody + markedFooter
    },
    lastUpdateDate(): string {
      return this.formattedDate(this.playlist.dateModified)
    },
    articleOutline(): string {
      return this.playlist.article.plainBody?.replace(/\n\n/g, '<br/>') || ''
    },
    isArticlePresent(): boolean {
      return this.articleOutline !== ''
    },
    playlistName(): string {
      const name = this.playlist?.name || ''
      return name.length > 24 ? name.slice(0, 24) + '…' : name
    },
  },
  methods: {
    formattedDate(_time: string): string {
      return moment(_time).format('YYYY/MM/DD HH:mm')
    },
    clickPlaylistItem() {
      this.$emit('click-playlist-item', this.playlist)
    },
  },
})
</script>

<style lang="scss" scoped>
.playlist_logo_image {
  width: 100%;
  max-width: 160px;
  border-radius: 4px;
}

.playlist-title .playlist-name {
  font-size: 20px;
  font-weight: bold;
  line-height: 1.7rem;
}

.article-info {
  width: calc(100% - 200px);
  min-height: 160px;
  position: relative;
}

.no_article {
  height: 100px;

  .no_article_text {
    padding-top: 5px;
  }
}

.dotted_hr {
  border: none;
  border-top: dashed 1px #cccccc;
  height: 1px;
  color: #ffffff;
}

.article_outline {
  background: white;
  position: relative;
  width: 100%;
  max-height: 90px;
  overflow: hidden;
  text-align: justify;
}

@media only screen and (min-width: 960px) and (max-width: 1264px) {
  .article_outline {
    max-height: 93px;
  }
}

.article_outline:before,
.article_outline:after {
  position: absolute;
}

.article_outline:before {
  bottom: 0;
  right: 0;
}

.article_outline:after {
  height: 100%;
  width: 100%;
  background: white;
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
