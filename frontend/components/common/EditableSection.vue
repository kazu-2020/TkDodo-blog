<template>
  <div>
    <div :id="editorId" />
    <v-btn rounded large color="secondary" class="d-none" @click="dumpSaveData">
      Save
    </v-btn>
    <v-snackbar
      v-model="snackBar"
      color="error"
      right
      top
      :timeout="snackBarTimeout"
    >
      {{ snackBarMessage }}
      <v-btn color="white" text @click="snackBar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import editorMixin from '~/components/common/editorMixin'
import editorBlockMixin from '~/components/common/editorBlockMixin'

export default {
  mixins: [editorMixin, editorBlockMixin],
  props: {
    sectionId: {
      type: String,
      required: true,
      default: 'editableSection',
    },
    initialData: {
      type: Object,
      required: false,
      default: () => ({
        time: 1589951040948,
        blocks: [
          {
            type: 'header',
            data: {
              text: 'Section1',
              level: 2,
            },
          },
          {
            type: 'paragraph',
            data: {
              text: 'Section 1 のテキストです。',
            },
          },
        ],
      }),
    },
    imageByFileEndpoint: {
      type: String,
      required: true,
    },
    imageByUrlEndpoint: {
      type: String,
      required: true,
    },
    episodeBlockId: {
      type: String,
      required: false,
      default: 'episode-block-id',
    },
    playlistId: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      editor: {},
      editorId: `editor-${this.sectionId}`,
      editorData: this.initialData,
      snackBar: false,
      snackBarMessage: '',
      snackBarTimeout: 5000,
    }
  },
  watch: {
    // 親コンポーネントがデータを書き換えたときに、このプロパティーも切り替わる
    // このプロパティーを監視して、自身のデータを再描画する
    episodeBlockId: {
      handler() {
        if ('render' in this.editor) {
          this.editorData = this.initialData
          this.editor.render(this.editorData)
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    // Call from basicEditorMixin
    initializeEditor() {
      this.editor.blocks.insert()
    },
    // Call from basicEditorMixin
    updateEditorData() {
      this.editor
        .save()
        .then((outputData) => {
          this.prune(outputData)
          this.editorData = outputData
          this.$emit('modify-content', {
            sectionId: this.sectionId,
            editorData: this.editorData,
          })
        })
        .catch((error) => {
          console.log('Saving failed: ', error)
          this.showErrorMessage(error)
        })
        .finally(() => {
          if (this.editor.blocks.getBlocksCount() < 1) {
            this.editor.blocks.insert()
          }
        })
    },
    dumpSaveData() {
      console.log('Article data: ', JSON.stringify(this.editorData))
    },
    isIncludeEpisodeBlock(data) {
      const episodeBlock = data.blocks.find((b) =>
        this.isEpisodeRelatedBlock(b.type)
      )
      return episodeBlock !== undefined
    },
    showErrorMessage(message) {
      this.snackBarMessage = message
      this.snackBar = true
    },
    prune(outputData) {
      if (!outputData.blocks) return

      // metaキー内が空の場合に親クラス内のrender処理が意図しない動作をするのでdescriptionキーを設定する
      const addEmptyDescription = (block) => {
        if (block.type === 'linkTool' && !Object.keys(block.data.meta).length) {
          block.data.meta.description = ''
        }
        return block
      }
      // linkキーが空のblockは保存しないように
      const emptyLinkFilter = (block) =>
        !(block.type === 'linkTool' && block.data.link === '')

      outputData.blocks = outputData.blocks
        .map(addEmptyDescription)
        .filter(emptyLinkFilter)
    },
  },
}
</script>

<style lang="scss">
@import '~/assets/css/editorjs/plugins.scss';

.ce-toolbox__button[data-tool='episode'],
.ce-toolbox__button[data-tool='tvEvent'],
.ce-toolbox__button[data-tool='howTo'],
.ce-toolbox__button[data-tool='recipe'] {
  display: none;
}
</style>
