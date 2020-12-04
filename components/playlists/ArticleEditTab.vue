<template>
  <v-row>
    <v-col cols="12">
      <div v-if="isShowHeader">
        <h3 class="mb-4">ヘッダー</h3>
        <v-textarea v-model="header" outlined auto-grow />
      </div>
      <div v-else>
        <v-btn block text class="mb-4 pa-4" @click="addHeader"
          >ヘッダーを入力
        </v-btn>
      </div>
      <hr class="dotted_hr" />
    </v-col>
    <v-col cols="12">
      <h3>記事本文</h3>
      <editable-section
        key="sandbox2"
        section-id="sandbox2"
        :playlist-id="playlist.id"
        :initial-data="body"
        :episode-block-id="episodeBlockId"
        class="mb-8"
        :image-by-file-endpoint="imageByFileEndpoint"
        :image-by-url-endpoint="imageByUrlEndpoint"
        @modify-content="setCurrentContent"
      />
      <hr class="dotted_hr" />
    </v-col>
    <v-col cols="12">
      <div v-if="isShowFooter">
        <h3 class="mb-4">フッター</h3>
        <v-textarea v-model="footer" outlined auto-grow />
      </div>
      <div v-else>
        <v-btn block text class="mb-4 pa-4" @click="addFooter"
          >フッターを入力
        </v-btn>
      </div>
    </v-col>
    <v-col cols="12" class="vertical_divider">
      <v-sheet color="grey lighten-3" rounded class="pb-2 mb-1">
        <iconed-title
          icon="mdi-account-edit"
          title="編集者情報の入力"
          class="ma-4 pt-4"
        />
        <hr class="title_divider" />
        <v-sheet color="white" class="ma-4 pa-4" rounded>
          <v-form ref="form" v-model="valid">
            <h4>著者 <small class="text--secondary"> - Author</small></h4>
            <v-radio-group v-model="authorType" mandatory row>
              <v-radio label="個人(Person)" value="Person" />
              <v-radio label="グループ(Organization)" value="Organization" />
            </v-radio-group>
            <h4>
              著者名 <small class="text--secondary"> - Author Name</small>
            </h4>
            <v-text-field v-model="authorName" :rules="[required]" />
            <h4>発行者 <small class="text--secondary"> - Publisher</small></h4>
            <v-radio-group v-model="publisherType" mandatory row>
              <v-radio label="個人(Person)" value="Person" />
              <v-radio label="グループ(Organization)" value="Organization" />
            </v-radio-group>
            <h4>
              発行者名 <small class="text--secondary"> - Publisher Name</small>
            </h4>
            <v-text-field v-model="publisherName" :rules="[required]" />
          </v-form>
        </v-sheet>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import Vue from 'vue'
import EditableSection from '~/components/common/EditableSection.vue'
import editorBlockMixin from '~/components/common/editorBlockMixin'
import IconedTitle from '~/components/common/IconedTitle.vue'

export default Vue.extend({
  name: 'ArticleEditTab',
  components: {
    EditableSection,
    IconedTitle,
  },
  mixins: [editorBlockMixin],
  props: {
    playlist: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      article: this.playlist.article,
      body: undefined,
      draftBody: {},
      header: undefined,
      footer: undefined,
      isShowHeader: undefined,
      isShowFooter: undefined,
      authorType: this.playlist.article.authorType || 'Organization',
      authorName: this.playlist.article.authorName || 'デジタルラボ',
      publisherName: this.playlist.article.publisherName || 'NHK',
      publisherType: this.playlist.article.publisherType || 'Organization',
      required: (value) => !!value || '必ず入力してください',
      valid: true,
    }
  },
  computed: {
    playlistName() {
      return this.playlist.name
    },
    episodeBlockId() {
      if (this.body?.time) {
        return this.body.time.toString()
      } else {
        return Date.now().toString()
      }
    },
    shouldSaveHeader() {
      return this.isShowHeader && this.header !== ''
    },
    shouldSaveFooter() {
      return this.isShowFooter && this.footer !== ''
    },
    imageByUrlEndpoint() {
      return `/playlists/${this.playlist.id}/upload_article_image_by_url`
    },
    imageByFileEndpoint() {
      return `/playlists/${this.playlist.id}/upload_article_image_by_file`
    },
    diffEpisodeItems() {
      const playlistItems = this.playlist.items || []
      const articleItems = this.playlist.article?.containsEpisodes || []

      const diffItems = articleItems.filter(
        (v) => !playlistItems.map((x) => x.id).includes(v.id)
      )

      return diffItems
    },
  },
  watch: {
    playlist: {
      handler(newVal) {
        this.article = newVal.article
        this.body = newVal.article.body
        this.header =
          this.playlist.article.header ||
          this.$cookies.get('articleHeaderText') ||
          ''
        this.footer =
          this.playlist.article.footer ||
          this.$cookies.get('articleFooterText') ||
          ''
        this.isShowHeader =
          this.playlist.article.header !== undefined &&
          this.playlist.article.header !== null
        this.isShowFooter =
          this.playlist.article.footer !== undefined &&
          this.playlist.article.footer !== null
      },
      immediate: true,
    },
    authorType: {
      handler(newVal) {
        const originalArticle = Object.assign({}, this.article)
        const article = Object.assign(originalArticle, { authorType: newVal })
        this.$emit('update-article', article)
      },
      immediate: true,
    },
    authorName: {
      handler(newVal) {
        const originalArticle = Object.assign({}, this.article)
        const article = Object.assign(originalArticle, { authorName: newVal })
        this.$emit('update-article', article)
      },
      immediate: true,
    },
    publisherType: {
      handler(newVal) {
        const originalArticle = Object.assign({}, this.article)
        const article = Object.assign(originalArticle, {
          publisherType: newVal,
        })
        this.$emit('update-article', article)
      },
      immediate: true,
    },
    publisherName: {
      handler(newVal) {
        const originalArticle = Object.assign({}, this.article)
        const article = Object.assign(originalArticle, {
          publisherName: newVal,
        })
        this.$emit('update-article', article)
      },
      immediate: true,
    },
    header: [
      {
        handler() {
          this.$cookies.set('articleHeaderText', this.header, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
          })
          const originalArticle = Object.assign({}, this.article)
          const headerText = this.shouldSaveHeader ? this.header : null
          const article = Object.assign(originalArticle, { header: headerText })
          this.$emit('update-article', article)
        },
        immediate: true,
      },
    ],
    footer: [
      {
        handler() {
          this.$cookies.set('articleFooterText', this.footer, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
          })
          const originalArticle = Object.assign({}, this.article)
          const footerText = this.shouldSaveFooter ? this.footer : null
          const article = Object.assign(originalArticle, { footer: footerText })
          this.$emit('update-article', article)
        },
        immediate: true,
      },
    ],
    valid: {
      handler(newValue) {
        this.$emit('update-validation', newValue)
      },
    },
  },
  methods: {
    addHeader() {
      this.isShowHeader = true
    },
    addFooter() {
      this.isShowFooter = true
    },
    setCurrentContent(payload) {
      const originalArticle = Object.assign({}, this.article)
      const article = Object.assign(originalArticle, {
        body: payload.editorData,
      })
      this.$emit('update-article', article)
    },
  },
})
</script>

<style lang="scss" scoped>
.title_divider {
  border: none;
  border-top: solid 2px #bdbdbd;
  height: 1px;
}
</style>
