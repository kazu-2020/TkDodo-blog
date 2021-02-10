<template>
  <v-card class="mx-auto" outlined light>
    <v-container>
      <v-row class="px-4">
        <v-col class="playlist_logo_block py-0">
          <v-row class="pa-4">
            <v-col cols="2" sm="3" xs="5" class="pa-0 pl-1 pb-1 mt-1 pr-4">
              <v-img
                :src="logoImageUrl"
                class="playlist_logo_image"
                aspect-ratio="1"
              />
            </v-col>
            <v-col
              class="mr-auto pl-0 pt-0 information"
              cols="10"
              sm="9"
              xs="7"
            >
              <v-card-title class="title mb-1 pl-0">
                <a class="playlist-title" @click="clickPlaylistItem">
                  <span class="playlist-name">{{ playlist.name }}</span>
                  <v-chip class="ma-2" small :color="publishedStateColor">{{
                    publishedState
                  }}</v-chip>
                </a>
              </v-card-title>
              <v-card-text
                v-if="isArticlePresent"
                class="article_outline hidden-sm-and-down pl-0"
              >
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p style="text-align: start" v-html="articleOutline" />
              </v-card-text>
              <v-card-text v-else>
                <div class="no_article">
                  <p class="no_article_text">記事はまだありません</p>
                </div>
              </v-card-text>
              <v-card-text class="card_list_item pb-1 d-inline-block pl-0">
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
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

export default Vue.extend({
  name: 'ArticleItem',
  components: {},
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
      return this.playlist.article.plainBody?.replace(/\n/g, '<br/>') || ''
    },
    isArticlePresent(): boolean {
      return this.articleOutline !== ''
    },
    publishedState(): string {
      return this.playlist?.publishedState === 'draft' ? '下書き' : '非公開'
    },
    publishedStateColor(): string {
      return this.playlist?.publishedState === 'draft'
        ? 'grey lighten-1'
        : 'deep-orange darken-1'
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

.v-card__title.title {
  padding-top: 0;
  padding-bottom: 0;
}

.playlist-title .playlist-name {
  text-decoration: underline;
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
    max-height: 49px;
  }
}

.article_outline:before,
.article_outline:after {
  position: absolute;
}

.article_outline:before {
  content: '…';
  bottom: 0;
  right: 0;
}

.article_outline:after {
  content: '';
  height: 100%;
  width: 100%;
  background: white;
}

.last_updated_at,
.episodes_count {
  color: #4f4f4f;
}

.information {
  position: relative;
}

.card_list_item {
  position: absolute;
  bottom: 0;
}

@media only screen and (max-width: 600px) {
  .card_list_item {
    position: relative;
  }
}
</style>
