<template>
  <v-card class="mx-auto" outlined light>
    <v-container>
      <v-row>
        <v-col cols="2" class="pt-2 pb-0 pr-0">
          <v-img
            :src="logoImageUrl"
            class="playlist_logo_image"
            aspect-ratio="1"
          />
        </v-col>
        <v-col class="mr-auto pt-0" cols="8" xs="2" sm="6" md="7">
          <v-card-title class="title mb-1">
            <nuxt-link
              :to="{ name: 'playlists-id', params: { id: playlist.id } }"
            >
              {{ playlist.name }}
            </nuxt-link>
          </v-card-title>
          <v-card-text v-if="isArticlePresent" class="article_outline">
            <p v-html="articleOutline" />
          </v-card-text>
          <v-card-text v-else>
            <div class="no_article">
              <v-icon>mdi-note-outline</v-icon>
              <p class="no_article_text">記事はまだありません</p>
            </div>
          </v-card-text>
        </v-col>
        <v-col class="text-center pl-0 pt-0" cols="auto">
          <v-row class="hidden-xs-only">
            <v-col>
              {{ lastUpdateDate }}
              <br />
              更新
            </v-col>
          </v-row>
          <v-row class="hidden-xs-only">
            <v-col>Ep数: {{ playlist.itemNum }}</v-col>
          </v-row>
          <v-row>
            <v-col>
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
          </v-row>
          <v-row>
            <v-col>
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
  },
  methods: {
    deletePlaylist(): void {
      if (confirm('本当に削除しますか？')) {
        this.$emit('delete-playlist', this.playlist)
      }
    },
    formattedDate(_time: string): string {
      return moment(_time).format('YYYY/MM/DD HH:mm')
    },
  },
})
</script>

<style lang="scss" scoped>
.playlist_logo_image {
  width: 100%;
}

.v-card__title.title {
  padding-top: 0;
  padding-bottom: 0;
}

.article_preview {
  overflow: scroll;
  height: 160px;
  width: 100%;
}

.no_article {
  text-align: center;
  height: 150px;

  i {
    padding-top: 32px;
    font-size: 4em;
  }

  .no_article_text {
    padding-top: 20px;
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
  height: 180px;
  overflow: hidden;
  text-align: justify;
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
</style>

<style lang="scss">
.article_preview {
  p img {
    width: 100%;
  }
}
</style>
