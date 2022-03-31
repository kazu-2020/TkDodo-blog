<template>
  <div>
    <div
      v-show="isShowInsertBlockButton"
      class="new-block-button"
      @click="insertNewBlock"
    >
      <v-icon class="new-block-button-icon">mdi-plus</v-icon>
      新しいブロックを追加する
    </div>
    <div :id="editorId" />
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
      isShowInsertBlockButton: false,
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
    editorData: {
      handler() {
        const firstBlock = this.editor.blocks.getBlockByIndex(0)
        this.isShowInsertBlockButton = !firstBlock.isEmpty
      },
    },
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    // Call from basicEditorMixin
    initializeEditor() {
      this.editor.blocks.insert()
      const firstBlock = this.editor.blocks.getBlockByIndex(0)
      this.isShowInsertBlockButton = !firstBlock.isEmpty
    },
    // Call from basicEditorMixin
    updateEditorData() {
      setTimeout(() => {
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
      }, 200)
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
    insertNewBlock() {
      this.isShowInsertBlockButton = false
      this.editor.blocks.insert('paragraph', {}, {}, 0, false)
      this.editor.caret.setToFirstBlock('end', 0)
    },
  },
}
</script>

<style lang="scss" scoped>
.new-block-button {
  border: 1px dotted #c6bebb;
  color: #c6bebb;
  max-width: 650px;
  border-radius: 4px;
  padding: 4px 8px;
  margin: 0 auto 10px;
  cursor: pointer;

  &:hover {
    background-color: #c6bebb;
    color: black;

    .new-block-button-icon {
      color: black;
    }
  }

  .new-block-button-icon {
    color: #c6bebb;
    position: relative;
    top: -2px;

    &:hover {
      color: black;
    }
  }
}
</style>

<style lang="scss">
@import '~/assets/css/editorjs/plugins.scss';

.ce-toolbox__button[data-tool='episode'],
.ce-toolbox__button[data-tool='tvEvent'],
.ce-toolbox__button[data-tool='howTo'],
.ce-toolbox__button[data-tool='recipe'] {
  display: none;
}

.codex-editor--narrow .codex-editor__redactor {
  margin-right: 0;
}

.ce-conversion-tool__icon svg {
  width: 15px;
  height: 15px;
}
</style>
