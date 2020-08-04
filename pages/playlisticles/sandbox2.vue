<template>
  <div class="editor-sandbox">
    <div class="title">
      Playlisticle Sandbox
      <v-btn
        class="ml-2"
        @click.stop="isShowPreviewDrawer = !isShowPreviewDrawer"
      >
        <v-icon class="mr-2">
          mdi-eye
        </v-icon>
        Preview
      </v-btn>
    </div>
    <v-divider class="ma-2" />
    <v-layout column>
      <v-row>
        <v-col xs="12" sm="12" md="8" lg="8">
          <editable-section
            key="sandbox2"
            section-id="sandbox2"
            :initial-data="article"
            :episode-block-id="episodeBlockId"
            class="mr-8"
          />
        </v-col>
        <v-col xs="12" sm="12" md="4" lg="4" :class="verticalDivider">
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
            :dark="isDarkMode"
            :minute-interval="5"
          />
          <v-divider />
          <div class="title py-2">
            <span>{{ playlist.name }}</span> のアイテム一覧
          </div>
          <episode-block-item
            v-for="item in playlist.items"
            :key="item.id"
            class="my-4"
            :episode="item"
            @add-block="addNewBlock"
          />
          <v-text-field
            v-model="keyword"
            label="他のエピソードを探す"
            prepend-inner-icon="mdi-magnify"
            solo
            class="episode-search"
            hide-details
          />
        </v-col>
      </v-row>
    </v-layout>
    <preview-drawer
      key="time"
      :is-show-drawer="isShowPreviewDrawer"
      :preview-data="article"
      @current-drawer-state="updatePreviewDrawerState"
    />
    <v-snackbar v-model="snackBar" color="success" right top :timeout="3000">
      保存しました（ダミーです）
    </v-snackbar>
  </div>
</template>

<script>
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import moment from 'moment'
import EditableSection from '~/components/EditableSection.vue'
import PreviewDrawer from '~/components/PreviewDrawer.vue'
import editorBlockMixin from '~/components/mixins/editorBlockMixin'
import EpisodeBlockItem from '~/components/EpisodeBlockItem.vue'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

export default {
  components: {
    'editable-section': EditableSection,
    'preview-drawer': PreviewDrawer,
    'episode-block-item': EpisodeBlockItem,
    'vue-ctk-date-time-picker': VueCtkDateTimePicker,
  },
  mixins: [editorBlockMixin],
  asyncData({ $axios }) {
    return $axios.get('/api/playlisticles/sandbox2').then((res) => {
      return {
        article: res.data.playlisticle.article,
        playlist: res.data.playlisticle.playlist,
      }
    })
  },
  data() {
    return {
      isShowPreviewDrawer: false,
      selectedSection: null,
      article: {},
      playlist: {},
      reservePublishmentButtonTitle: '予約公開する',
      saveButton: null,
      saveButtons: [
        { text: '下書きとして保存', callback: this.saveArticle },
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
    playlisticle() {
      return this.$store.state.playlisticles.editingPlaylisticle
    },
    verticalDivider() {
      if (this.$vuetify.theme.dark) {
        return 'vertical_divider dark'
      } else {
        return 'vertical_divider'
      }
    },
    episodeBlockId() {
      if (this.article?.time) {
        return this.article.time.toString()
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
    isDarkMode() {
      return this.$vuetify.theme.dark
    },
  },
  methods: {
    updatePreviewDrawerState(newVal) {
      this.isShowPreviewDrawer = newVal
    },
    addNewBlock(blockData) {
      this.article.blocks.push(blockData)
      this.article.time = Date.now()
    },
    saveArticle() {
      if (this.saveArticle === '') return
      if (
        this.saveButton === this.reservePublishmentButtonTitle &&
        this.reservedPublishDateTime === ''
      ) {
        alert('予約公開する日付を決めてください')
        return false
      }
      this.snackBar = true
    },
  },
}
</script>

<style scoped lang="scss">
.vertical_divider {
  border-left: 1px solid rgba(0, 0, 0, 0.12);

  &.dark {
    border-left: 1px solid rgba(255, 255, 255, 0.12);
  }
}
</style>
