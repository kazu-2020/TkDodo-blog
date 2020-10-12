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
              :playlist-id="playlist.id"
              :initial-data="body"
              :episode-block-id="episodeBlockId"
              class="mr-8 mb-8"
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

export default Vue.extend({
  name: 'PlaylistIdArticlePage',
  components: {
    'article-side-bar': ArticleSideBar,
    'editable-section': EditableSection,
    'preview-drawer': PreviewDrawer,
    'page-title': PageTitle,
  },
  mixins: [editorBlockMixin],
  asyncData({ $axios, params, app }) {
    return $axios
      .get(`/playlists/${params.id}/playlist_articles`)
      .then((res) => {
        return {
          playlist: res.data.playlist,
          body: res.data.article?.body || {},
          draftBody: res.data.article?.body || {},
          header:
            res.data.article?.header ||
            app.$cookies.get('articleHeaderText') ||
            '',
          footer:
            res.data.article?.footer ||
            app.$cookies.get('articleFooterText') ||
            '',
          isShowHeader:
            res.data.article?.header !== undefined &&
            res.data.article?.header !== null,
          isShowFooter:
            res.data.article?.footer !== undefined &&
            res.data.article?.footer !== null,
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
      return `/playlists/${this.playlist.id}/playlist_articles/upload_image_by_url`
    },
    imageByFileEndpoint() {
      return `/playlists/${this.playlist.id}/playlist_articles/upload_image_by_file`
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
    saveAsDraft() {
      this.$store.dispatch('loading/startLoading', {
        success: '保存しました',
        error: '保存失敗しました',
      })

      const headerText = this.shouldSaveHeader ? this.header : null
      const footerText = this.shouldSaveFooter ? this.footer : null

      this.$axios
        .post(`/playlists/${this.playlist.id}/playlist_articles`, {
          playlist_article: {
            header: headerText,
            body: JSON.stringify(this.draftBody),
            footer: footerText,
          },
        })
        .then((_response) => {
          this.$store.dispatch('loading/succeedLoading')
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
  left: -55px;
}

.ce-block--focused {
  .ce-block__content {
    background-color: #f7f7f7;
  }
}
</style>
