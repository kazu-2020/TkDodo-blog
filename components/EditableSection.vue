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
    episodeBlockType: {
      type: String,
      required: true,
      default: 'header',
    },
  },
  data() {
    return {
      editor: {},
      editorId: `${this.episodeBlockType}-${this.sectionId}`,
      editorData: this.initialData,
      snackBar: false,
      snackBarMessage: '',
      snackBarTimeout: 5000,
    }
  },
  watch: {
    episodeBlockId: {
      handler() {
        if ('render' in this.editor) {
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
        .then(outputData => {
          if (
            this.episodeBlockType !== 'body' ||
            this.isIncludeEpisodeBlock(outputData)
          ) {
            this.editorData = outputData
            this.$emit('modify-content', {
              sectionId: this.sectionId,
              editorData: this.editorData,
            })
          } else {
            this.editor.render(this.editorData)
            throw new Error('エピソード関連のブロックは削除できません')
          }
        })
        .catch(error => {
          console.log('Saving failed: ', error)
          this.showErrorMessage(error)
        })
    },
    dumpSaveData() {
      console.log('Article data: ', JSON.stringify(this.editorData))
    },
    isIncludeEpisodeBlock(data) {
      const episodeBlock = data.blocks.find(b =>
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

.ce-toolbox__button[data-tool='episode'],
.ce-toolbox__button[data-tool='tvEvent'],
.ce-toolbox__button[data-tool='howTo'],
.ce-toolbox__button[data-tool='recipe'] {
  display: none;
}
</style>
