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
        </v-col>
      </v-row>
    </v-layout>
    <preview-drawer
      key="time"
      :is-show-drawer="isShowPreviewDrawer"
      :preview-data="article"
      @current-drawer-state="updatePreviewDrawerState"
    />
  </div>
</template>

<script>
import EditableSection from '~/components/EditableSection.vue'
import PreviewDrawer from '~/components/PreviewDrawer.vue'
import editorBlockMixin from '~/components/mixins/editorBlockMixin'
import EpisodeBlockItem from '~/components/EpisodeBlockItem.vue'

export default {
  components: {
    'editable-section': EditableSection,
    'preview-drawer': PreviewDrawer,
    'episode-block-item': EpisodeBlockItem,
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
  },
  methods: {
    updatePreviewDrawerState(newVal) {
      this.isShowPreviewDrawer = newVal
    },
    addNewBlock(blockData) {
      this.article.blocks.push(blockData)
      this.article.time = Date.now()
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
