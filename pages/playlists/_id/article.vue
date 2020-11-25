<template>
  <div>
    <page-title :page-title="`${playlistName} の記事編集ページ`" class="mt-4" />
    <v-divider class="ma-2" />
    <v-layout column>
      <v-row>
        <v-col xs="12" sm="12" md="8" lg="8">
          <v-col>
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
          <v-col>
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
          <v-col>
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
        </v-col>
        <v-col xs="12" sm="12" md="4" lg="4" class="vertical_divider">
          <article-side-bar
            :author-name.sync="authorName"
            :author-type.sync="authorType"
            :publisher-name.sync="publisherName"
            :publisher-type.sync="publisherType"
            @click-preview-button="togglePreviewState"
            @notify-dummy="notifyDummy"
            @click-save-button="saveAsDraft"
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
    <article-saved-dialog
      :is-show-dialog="isShowDialog"
      :playlist="playlist"
      :diff-items="diffEpisodeItems"
      @hide-new-playlist-dialog="isShowDialog = false"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import ArticleSideBar from '~/components/playlists/ArticleSideBar.vue'
import EditableSection from '~/components/common/EditableSection.vue'
import PageTitle from '~/components/common/PageTitle.vue'
import PreviewDrawer from '~/components/common/PreviewDrawer.vue'
import editorBlockMixin from '~/components/common/editorBlockMixin'
import ArticleSavedDialog from '~/components/playlists/ArticleSavedDialog.vue'
import unloadAlertMixin from '~/components/common/unloadAlertMixin'

export default Vue.extend({
  name: 'PlaylistIdArticlePage',
  components: {
    ArticleSavedDialog,
    ArticleSideBar,
    EditableSection,
    PreviewDrawer,
    PageTitle,
  },
  mixins: [editorBlockMixin, unloadAlertMixin],
  asyncData({ $axios, params, app }) {
    return $axios.get(`/playlists/${params.id}`).then((res) => {
      const authorName = res.data.playlist.article?.authorName
        ? res.data.playlist.article?.authorName
        : 'デジタルラボ'
      const authorType = res.data.playlist.article?.authorType
        ? res.data.playlist.article?.authorType
        : 'Organization'
      const publisherName = res.data.playlist.article?.publisherName
        ? res.data.playlist.article?.publisherName
        : 'NHK'
      const publisherType = res.data.playlist.article?.publisherType
        ? res.data.playlist.article?.publisherType
        : 'Organization'

      return {
        playlist: res.data.playlist,
        body: res.data.playlist.article?.body || {},
        draftBody: res.data.playlist.article?.body || {},
        header:
          res.data.playlist.article?.header ||
          app.$cookies.get('articleHeaderText') ||
          '',
        footer:
          res.data.playlist.article?.footer ||
          app.$cookies.get('articleFooterText') ||
          '',
        isShowHeader:
          res.data.playlist.article?.header !== undefined &&
          res.data.playlist.article?.header !== null,
        isShowFooter:
          res.data.playlist.article?.footer !== undefined &&
          res.data.playlist.article?.footer !== null,
        authorName,
        authorType,
        publisherName,
        publisherType,
      }
    })
  },
  data() {
    return {
      body: {},
      draftBody: {},
      header: this.$cookies.get('articleHeaderText') || '',
      footer: this.$cookies.get('articleFooterText') || '',
      playlist: {},
      isShowPreviewDrawer: false,
      snackBar: false,
      snackBarMessage: '',
      isShowHeader: false,
      isShowFooter: false,
      isShowDialog: false,
      authorType: undefined,
      authorName: undefined,
      publisherName: undefined,
      publisherType: undefined,
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
    reserveMinDate() {
      const minDate = moment()
      return minDate.format('YYYY-MM-DDTHH:mm:ss')
    },
    reserveMaxDate() {
      const minDate = moment(this.reserveMinDate)
      const maxDate = minDate.add(1, 'year').endOf('day')
      return maxDate.format('YYYY-MM-DDTHH:mm:ss')
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
    header: [
      {
        handler() {
          this.$cookies.set('articleHeaderText', this.header, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
          })
        },
        immediate: true,
      },
      {
        handler() {
          this.isShowUnloadAlert = true
        },
      },
    ],
    draftBody: {
      handler() {
        this.isShowUnloadAlert = true
      },
      deep: true,
    },
    footer: [
      {
        handler() {
          this.$cookies.set('articleFooterText', this.footer, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
          })
        },
        immediate: true,
      },
      {
        handler() {
          this.isShowUnloadAlert = true
        },
      },
    ],
  },
  mounted() {
    this.isShowDialog = this.$route.query.showDialog === '1'
  },
  methods: {
    updatePreviewDrawerState(newVal) {
      this.isShowPreviewDrawer = newVal
    },
    setCurrentContent(payload) {
      this.draftBody = payload.editorData
    },
    saveAsDraft() {
      this.isShowUnloadAlert = false
      this.$store.dispatch('loading/startLoading', {
        success: '保存しました',
        error: '保存失敗しました',
      })

      const headerText = this.shouldSaveHeader ? this.header : null
      const footerText = this.shouldSaveFooter ? this.footer : null

      this.$axios
        .post(`/playlists/${this.playlist.id}`, {
          playlist: {
            marked_header: headerText,
            editor_data: JSON.stringify(this.draftBody),
            marked_footer: footerText,
            author_type: this.authorType,
            author_name: this.authorName,
            publisher_name: this.publisherName,
            publisher_type: this.publisherType,
          },
        })
        .then((response) => {
          this.playlist = response.data.playlist
          if (this.diffEpisodeItems.length === 0) {
            this.$store.dispatch('loading/succeedLoading')
          } else {
            this.$store.dispatch('loading/resetLoadingState')
            this.isShowDialog = true
          }
        })
        .catch((_error) => {
          this.$store.dispatch('loading/failLoading')
        })
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
  },
})
</script>

<style scoped>
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
