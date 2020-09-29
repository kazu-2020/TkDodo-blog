<template>
  <div>
    <page-title :page-title="`${playlistName} の記事編集ページ`" class="mt-4" />
    <v-divider class="ma-2" />
    <v-layout column>
      <v-row>
        <v-col xs="12" sm="12" md="8" lg="8">
          <h3>ヘッダー</h3>
          <v-textarea v-model="header" outlined auto-grow />
          <hr />
        </v-col>
        <v-col xs="12" sm="12" md="4" lg="4" class="vertical_divider">
          <v-btn
            block
            class="my-2"
            @click.stop="isShowPreviewDrawer = !isShowPreviewDrawer"
          >
            <v-icon class="mr-2"> mdi-eye </v-icon>
            Preview
          </v-btn>
          <v-btn block color="secondary">
            <v-icon>mdi-export</v-icon>
            記事からプレイリストを作成/更新
          </v-btn>
          <v-overflow-btn
            v-model="saveButton"
            class="my-2"
            :items="saveButtons"
            label="保存方法を選択してください"
            segmented
            background-color="primary"
            @click="saveArticle"
          />
          <vue-ctk-date-time-picker
            v-show="saveButton === reservePublishmentButtonTitle"
            v-model="reservedPublishDateTime"
            class="pb-8"
            label="公開日時を選んでください"
            :min-date="reserveMinDate"
            :max-date="reserveMaxDate"
            :minute-interval="5"
          />
        </v-col>
        <v-col xs="12" sm="12" md="8" lg="8">
          <h3>記事本文</h3>
          <editable-section
            key="sandbox2"
            section-id="sandbox2"
            :playlist-id="playlist.id"
            :initial-data="body"
            :episode-block-id="episodeBlockId"
            class="mr-8 mb-8"
            @modify-content="setCurrentContent"
          />
          <hr />
        </v-col>
        <v-col xs="12" sm="12" md="8" lg="8">
          <h3>フッター</h3>
          <v-textarea v-model="footer" outlined auto-grow />
          <hr />
        </v-col>
      </v-row>
    </v-layout>
    <preview-drawer
      key="time"
      :is-show-drawer="isShowPreviewDrawer"
      :preview-data="body"
      @current-drawer-state="updatePreviewDrawerState"
    />
    <v-snackbar v-model="snackBar" color="success" right top :timeout="3000">
      保存しました（ダミーです）
    </v-snackbar>
  </div>
</template>

<script>
import Vue from 'vue'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import moment from 'moment'
import EditableSection from '~/components/EditableSection.vue'
import PageTitle from '~/components/molecules/PageTitle.vue'
import PreviewDrawer from '~/components/PreviewDrawer.vue'
import editorBlockMixin from '~/components/mixins/editorBlockMixin'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

export default Vue.extend({
  name: 'PlaylistIdArticlePage',
  components: {
    'editable-section': EditableSection,
    'preview-drawer': PreviewDrawer,
    'vue-ctk-date-time-picker': VueCtkDateTimePicker,
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
      reservePublishmentButtonTitle: '予約公開する',
      saveButton: null,
      saveButtons: [
        { text: '下書きとして保存', callback: this.saveAsDraft },
        {
          text: '予約公開する',
          callback: this.saveArticle,
        },
      ],
      reservedPublishDateTime: '',
      snackBar: false,
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
    saveArticle() {
      if (this.saveButton === '') return false
      if (
        this.saveButton === this.reservePublishmentButtonTitle &&
        this.reservedPublishDateTime === ''
      ) {
        alert('予約公開する日付を決めてください')
        return false
      }

      this.snackBar = true
      return true
    },
    saveAsDraft() {
      this.$store.dispatch('loading/startLoading', {
        success: '保存しました',
        error: '保存失敗しました',
      })

      const headerText = this.header === '' ? null : this.header
      const footerText = this.footer === '' ? null : this.footer

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
  },
})
</script>

<style scoped>
.playlist-title {
  display: inline-block;
}
</style>
