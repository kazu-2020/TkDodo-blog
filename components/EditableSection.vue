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
import editorMixin from '~/components/mixins/editorMixin'
import editorBlockMixin from '~/components/mixins/editorBlockMixin'

export default {
  mixins: [editorMixin, editorBlockMixin],
  props: {
    requireEpisodeBlock: {
      type: Boolean,
      required: false,
      default: false,
    },
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
    episodeBlockId: {
      type: String,
      required: false,
      default: 'episode-block-id',
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
          if (
            this.requireEpisodeBlock &&
            !this.isIncludeEpisodeBlock(outputData)
          ) {
            this.editor.render(this.editorData)
            throw new Error('エピソード関連のブロックは削除できません')
          } else {
            this.editorData = outputData
            this.$emit('modify-content', {
              sectionId: this.sectionId,
              editorData: this.editorData,
            })
          }
        })
        .catch((error) => {
          console.log('Saving failed: ', error)
          this.showErrorMessage(error)
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
  },
}
</script>

<style lang="scss">
@import '~/assets/css/editorjs/plugins.scss';

.ce-block__content,
.ce-toolbar__content {
  max-width: 980px;
}

.ce-toolbox__button[data-tool='tvEvent'],
.ce-toolbox__button[data-tool='howTo'],
.ce-toolbox__button[data-tool='recipe'] {
  display: none;
}
</style>
