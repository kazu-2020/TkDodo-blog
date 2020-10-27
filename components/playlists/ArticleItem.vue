<template>
  <v-card class="mx-auto" outlined light>
    <v-container class="container">
      <v-row>
        <v-col cols="12" class="pa-0">
          <v-img :src="heroImageUrl" class="playlist_hero_image" />
        </v-col>
        <v-col cols="12">
          <v-card-title class="title mb-1 playlist-title">
            <nuxt-link
              :to="{ name: 'playlists-id', params: { id: playlist.id } }"
            >
              {{ playlist.name }}
            </nuxt-link>
          </v-card-title>
        </v-col>
        <v-col cols="12">
          <hr class="dotted_hr" />
        </v-col>
        <v-col v-if="articleDetail === ''" cols="12" class="py-0 no_article">
          <div>
            <v-icon>mdi-note-outline</v-icon>
            <p class="no_article_text">記事はまだありません</p>
          </div>
        </v-col>
        <v-col v-else cols="12" class="py-0 article_preview">
          <vue-markdown class="pa-2">{{ articleDetail }}</vue-markdown>
        </v-col>
        <v-col cols="12">
          <hr class="dotted_hr" />
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-btn
        :to="{ name: 'playlists-id', params: { id: playlist.id } }"
        nuxt
        text
        color="primary"
      >
        編集
      </v-btn>
      <v-btn text color="primary" @click="deletePlaylist"> 削除 </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import VueMarkdown from 'vue-markdown'

export default Vue.extend({
  name: 'ArticleItem',
  components: {
    VueMarkdown,
  },
  props: {
    playlist: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  computed: {
    heroImageUrl(): string {
      return this.playlist.hero?.medium?.url || this.dummyImage
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
  },
  methods: {
    deletePlaylist(): void {
      if (confirm('本当に削除しますか？')) {
        this.$emit('delete-playlist', this.playlist)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.container {
  overflow: hidden;
  padding: 0;
}

.playlist_hero_image {
  height: 160px;
  overflow: hidden;
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
  height: 160px;

  i {
    padding-top: 16px;
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
</style>

<style lang="scss">
.article_preview {
  p img {
    width: 100%;
  }
}
</style>
