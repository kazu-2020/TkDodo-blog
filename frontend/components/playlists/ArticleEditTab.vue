<template>
  <div class="article-container container-fluid white rounded px-5 py-2">
    <v-row>
      <v-col cols="12">
        <h3 class="content-title">ヘッダー</h3>
        <div class="d-flex justify-center">
          <v-textarea
            v-model="header"
            outlined
            auto-grow
            class="text-area-width"
          />
        </div>
        <hr class="dotted_hr" />
      </v-col>
      <v-col cols="12">
        <v-alert dense outlined type="warning" class="content-title caption">
          <!-- eslint-disable-next-line no-irregular-whitespace vue/no-parsing-error -->
          コピーした文章や半角記号などは意図しない表示になる場合があります。半角記号（#　-　+　'　[　]　(　)　<　>　!　/　~　|　*　^　　.など）を起点に表示が意図通りになっていない場合は、全角文字に変更するか、その半角記号の前に\（バックスラッシュ・半角）を入力してみてください。
        </v-alert>
        <h3 class="content-title">記事本文</h3>
        <span class="character-counter float-right grey--text">
          {{ counter }} 文字
        </span>
        <editable-section
          key="sandbox2"
          section-id="sandbox2"
          :playlist-id="playlist.playlistUId"
          :initial-data="body"
          class="mb-8"
          :image-by-file-endpoint="imageByFileEndpoint"
          :image-by-url-endpoint="imageByUrlEndpoint"
          @modify-content="setCurrentContent"
        />
        <hr class="dotted_hr" />
      </v-col>
      <v-col cols="12">
        <h3 class="content-title">フッター</h3>
        <div class="d-flex justify-center">
          <v-textarea
            v-model="footer"
            outlined
            auto-grow
            class="text-area-width"
          />
        </div>
      </v-col>
      <v-col cols="12" class="vertical_divider">
        <v-sheet
          color="grey lighten-3"
          rounded
          class="pb-2 mb-1"
          style="max-width: 650px; margin: 0 auto 4px"
        >
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
              <h4>
                発行者 <small class="text--secondary"> - Publisher</small>
              </h4>
              <v-radio-group v-model="publisherType" mandatory row>
                <v-radio label="個人(Person)" value="Person" />
                <v-radio label="グループ(Organization)" value="Organization" />
              </v-radio-group>
              <h4>
                発行者名
                <small class="text--secondary"> - Publisher Name</small>
              </h4>
              <v-text-field v-model="publisherName" :rules="[required]" />
            </v-form>
          </v-sheet>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue'
import cloneDeep from 'lodash.clonedeep'
import PlainTextParser from '../../plugins/editorjs/plain_text_parser'
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
      authorType: this.playlist.article.authorType || 'Organization',
      authorName: this.playlist.article.authorName || 'デジタルラボ',
      publisherName: this.playlist.article.publisherName || 'NHK',
      publisherType: this.playlist.article.publisherType || 'Organization',
      required: (value) => !!value || '必ず入力してください',
      valid: true,
      initializing: true,
    }
  },
  computed: {
    playlistName() {
      return this.playlist.name
    },
    imageByUrlEndpoint() {
      return `/playlists/${this.playlist.playlistUId}/upload_article_image_by_url`
    },
    imageByFileEndpoint() {
      return `/playlists/${this.playlist.playlistUId}/upload_article_image_by_file`
    },
    diffEpisodeItems() {
      const playlistItems = this.playlist.items || []
      const articleItems = this.playlist.article?.containsEpisodes || []

      const diffItems = articleItems.filter(
        (v) => !playlistItems.map((x) => x.id).includes(v.id)
      )

      return diffItems
    },
    counter() {
      const plainText = PlainTextParser.parse(this.article.body)
      if (!plainText) return 0
      return plainText.length
    },
  },
  watch: {
    playlist: {
      handler(newVal) {
        this.article = cloneDeep(newVal.article)
        this.body = newVal.article.body || null
        this.header = this.playlist.article.header || ''
        this.footer = this.playlist.article.footer || ''
      },
      immediate: true,
    },
    authorType: {
      handler(newVal) {
        if (this.initializing) return
        this.article.authorType = newVal
        const originalArticle = Object.assign({}, this.article)
        const article = Object.assign(originalArticle, { authorType: newVal })
        this.$emit('update-article', article)
      },
      immediate: true,
    },
    authorName: {
      handler(newVal) {
        if (this.initializing) return
        this.article.authorName = newVal
        const originalArticle = Object.assign({}, this.article)
        const article = Object.assign(originalArticle, { authorName: newVal })
        this.$emit('update-article', article)
      },
      immediate: true,
    },
    publisherType: {
      handler(newVal) {
        if (this.initializing) return
        this.article.publisherType = newVal
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
        if (this.initializing) return
        this.article.publisherName = newVal
        const originalArticle = Object.assign({}, this.article)
        const article = Object.assign(originalArticle, {
          publisherName: newVal,
        })
        this.$emit('update-article', article)
      },
      immediate: true,
    },
    header: {
      handler() {
        this.updateArticle()
      },
      immediate: true,
    },
    footer: {
      handler() {
        this.updateArticle()
      },
      immediate: true,
    },
    valid: {
      handler(newValue) {
        this.$emit('update-validation', newValue)
      },
    },
  },
  mounted() {
    // 初期化時の `update-article` イベントを発行しないようにする
    this.initializing = false
  },
  methods: {
    setCurrentContent(payload) {
      if (this.initializing) return
      this.article.body = this.body = payload.editorData
      this.updateArticle()
    },
    updateArticle() {
      if (this.initializing) return
      const originalArticle = Object.assign({}, this.article)
      const article = Object.assign(originalArticle, {
        header: this.header,
        body: this.body,
        footer: this.footer,
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

<style lang="scss">
.content-title {
  max-width: 650px;
  margin: 0 auto 10px;
}

.text-area-width {
  max-width: 650px;
  margin: 0 auto;
}

.character-counter {
  position: relative;
  top: -50px;
  right: 0;
}

.ce-toolbar__actions {
  left: -50px;
  right: unset !important;
  top: 10px;
}

.ce-settings {
  left: -1px;
  right: auto;
}

.ce-toolbar__plus {
  left: -85px !important;
}

.ce-block--focused {
  .ce-block__content {
    background-color: #f7f7f7;
  }
}

.link-tool__warning__message {
  font-size: 12px;
  color: red;
}

.link-tool__anchor {
  font-size: 18px;
  color: #333;
  overflow-wrap: break-word;
}

.link-tool__content--rendered {
  border-radius: 6px 6px 0 0;
}

.link-tool__description {
  display: none;
}

.link-tool__input-description {
  border-radius: 0 0 6px 6px;
}

.link-tool__input-description[contentEditable='true'][data-placeholder]::before {
  position: absolute !important;
  content: attr(data-placeholder);
  color: #707684;
  font-weight: normal;
  display: none;
}

.link-tool__input-description[contentEditable='true'][data-placeholder]:empty::before {
  display: block;
}

.link-tool__input-description[contentEditable='true'][data-placeholder]:empty:focus::before {
  display: none;
}
</style>
