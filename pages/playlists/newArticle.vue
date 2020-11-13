<template>
  <div>
    <page-title page-title="記事からプレイリストを新規作成" class="mt-4" />
    <v-divider class="ma-2" />
    <v-layout column>
      <v-row>
        <v-col xs="12" sm="12" md="8" lg="8">
          <v-col>
            <v-form ref="form" v-model="valid" class="mb-2">
              <v-text-field
                v-model="name"
                label="タイトル（プレイリスト名） - Name"
                :rules="nameRules"
                required
                @keydown.enter.prevent="unfocusTextForm"
              />
            </v-form>
            <hr class="dotted_hr" />
          </v-col>
          <v-col>
            <div v-if="isShowHeader">
              <h3 class="mb-4">ヘッダー</h3>
              <v-textarea v-model="header" outlined auto-grow />
            </div>
            <div v-else>
              <v-btn block text class="mb-4 pa-4" @click="addHeader"
                >ヘッダーを入力</v-btn
              >
            </div>
            <hr class="dotted_hr" />
          </v-col>
          <v-col>
            <h3>記事本文</h3>
            <editable-section
              key="sandbox2"
              section-id="sandbox2"
              :initial-data="body"
              :episode-block-id="episodeBlockId"
              class="mb-8"
              :image-by-file-endpoint="imageByFileEndpoint"
              :image-by-url-endpoint="imageByUrlEndpoint"
              @modify-content="setCurrentContent"
            />
            <hr class="dotted_hr" />
          </v-col>
          <v-col>
            <div v-if="isShowFooter">
              <h3 class="mb-4">フッター</h3>
              <v-textarea v-model="footer" outlined auto-grow />
            </div>
            <div v-else>
              <v-btn block text class="mb-4 pa-4" @click="addFooter"
                >フッターを入力</v-btn
              >
            </div>
          </v-col>
        </v-col>
        <v-col xs="12" sm="12" md="4" lg="4" class="vertical_divider">
          <article-side-bar
            :save-as-new-playlist="true"
            :author-name.sync="authorName"
            :author-type.sync="authorType"
            :publisher.sync="publisher"
            @click-preview-button="togglePreviewState"
            @notify-dummy="notifyDummy"
            @click-save-button="save"
          />
        </v-col>
      </v-row>
    </v-layout>
    <preview-drawer
      key="time"
      :is-show-drawer="isShowPreviewDrawer"
      :preview-data="body"
      @current-drawer-state="updatePreviewDrawerState"
    />
    <v-snackbar v-model="snackBar" right top :timeout="3000">
      {{ snackBarMessage }}
    </v-snackbar>
    <v-dialog v-model="loadingDialog" hide-overlay persistent width="300">
      <v-card>
        <v-card-text>
          作成中...
          <v-progress-linear indeterminate class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import ArticleSideBar from '~/components/playlists/ArticleSideBar.vue'
import EditableSection from '~/components/common/EditableSection.vue'
import PageTitle from '~/components/common/PageTitle.vue'
import PreviewDrawer from '~/components/common/PreviewDrawer.vue'
import editorBlockMixin from '~/components/common/editorBlockMixin'

export default Vue.extend({
  name: 'PlaylistNewArticlePage',
  components: {
    'article-side-bar': ArticleSideBar,
    'editable-section': EditableSection,
    'preview-drawer': PreviewDrawer,
    'page-title': PageTitle,
  },
  mixins: [editorBlockMixin],
  data() {
    return {
      body: {},
      draftBody: {},
      header: this.$cookies.get('articleHeaderText') || '',
      footer: this.$cookies.get('articleFooterText') || '',
      valid: false,
      name: '',
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) =>
          (v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
      isShowPreviewDrawer: false,
      snackBar: false,
      snackBarMessage: '',
      isShowHeader: false,
      isShowFooter: false,
      loadingDialog: false,
      authorType: 'Organization',
      authorName: 'デジタルラボ',
      publisher: 'NHK',
    }
  },
  computed: {
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
      return ''
      // return `/playlists/${this.playlist.id}/upload_article_image_by_url`
    },
    imageByFileEndpoint() {
      return ''
      // return `/playlists/${this.playlist.id}/upload_article_image_by_file`
    },
  },
  watch: {
    header: {
      handler() {
        this.$cookies.set('articleHeaderText', this.header, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        })
      },
      immediate: true,
    },
    footer: {
      handler() {
        this.$cookies.set('articleFooterText', this.footer, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        })
      },
      immediate: true,
    },
  },
  methods: {
    updatePreviewDrawerState(newVal) {
      this.isShowPreviewDrawer = newVal
    },
    setCurrentContent(payload) {
      this.draftBody = payload.editorData
    },
    unfocusTextForm() {
      // noop
    },
    notifyDummy() {
      this.snackBar = true
      this.snackBarMessage = 'この機能は実装中です'
    },
    addHeader() {
      this.isShowHeader = true
    },
    addFooter() {
      this.isShowFooter = true
    },
    togglePreviewState() {
      this.isShowPreviewDrawer = !this.isShowPreviewDrawer
    },
    validate() {
      const form = this.$refs.form
      form.validate()
    },
    save() {
      this.validate()

      if (this.valid) {
        this.$store.dispatch('loading/startLoading', {
          success: '保存しました',
          error: '保存失敗しました',
        })
        this.loadingDialog = true

        const headerText = this.shouldSaveHeader ? this.header : null
        const footerText = this.shouldSaveFooter ? this.footer : null

        this.$accessor.playlists.createPlaylists({
          playlist: {
            name: this.name,
            marked_header: headerText,
            editor_data: JSON.stringify(this.draftBody),
            marked_footer: footerText,
            author_type: this.authorType,
            author_name: this.authorName,
            publisher: this.publisher,
          },
        })
        this.subscribeSubmitAction()
      }
    },
    subscribeSubmitAction() {
      this.$store.subscribeAction({
        after: (action, state) => {
          if (action.type !== 'playlists/createPlaylists') return

          if (state.playlists.allItems[0].name === this.name) {
            const playlist = state.playlists.allItems[0]
            const shouldShowDialog =
              playlist.article.containsEpisodes.length !== 0
            if (shouldShowDialog) {
              this.$router.push(
                `/playlists/${playlist.id}/article?showDialog=1`
              )
            } else {
              this.$router.push(`/playlists/${playlist.id}/article`)
            }
            this.$store.dispatch('loading/resetLoadingState')
          }

          this.loadingDialog = false
        },
        error: () => {
          this.$store.dispatch('loading/failLoading')
          this.loadingDialog = false
        },
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.playlist-title {
  display: inline-block;
}

.dotted_hr {
  border: none;
  border-top: dashed 1px #cccccc;
  height: 1px;
  color: #ffffff;
}
</style>

<style lang="scss">
.ce-toolbar__actions {
  left: -25px;
  top: 10px;
}

.ce-settings {
  left: -1px;
  right: auto;
}

.ce-toolbar__plus {
  left: -55px !important;
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

.link-tool__input-description {
  margin-top: 10px;
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
