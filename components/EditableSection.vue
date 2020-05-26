<template>
  <div>
    <div :id="editorId" />
    <v-btn rounded large color="secondary" class="d-none" @click="dumpSaveData">
      Save
    </v-btn>
  </div>
</template>

<script>
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import CodeTool from '@editorjs/code'
import Marker from '@editorjs/marker'
import Delimiter from '@editorjs/delimiter'
import InlineCode from '@editorjs/inline-code'
import LinkTool from '@editorjs/link'
import Embed from '@editorjs/embed'
import Table from '@editorjs/table'
import Episode from '~/plugins/editorjs/episode.js'
import TvEvent from '~/plugins/editorjs/tv_event.js'

export default {
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
  },
  data() {
    return {
      editor: {},
      editorId: this.sectionId,
      editorData: this.initialData,
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
  mounted() {
    this.doEditor()
  },
  methods: {
    doEditor() {
      this.editor = new EditorJS({
        holder: this.editorId,
        minHeight: 0,
        tools: {
          header: {
            class: Header,
            inlineToolbar: ['link'],
            config: {
              placeholder: 'Header',
            },
            shortcut: 'CMD+SHIFT+H',
          },
          list: {
            class: List,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+L',
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: "Quote's author",
            },
            shortcut: 'CMD+SHIFT+O',
          },
          code: {
            class: CodeTool,
            shortcut: 'CMD+SHIFT+C',
          },
          marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M',
          },
          delimiter: Delimiter,
          inlineCode: {
            class: InlineCode,
            shortcut: 'CMD+SHIFT+C',
          },
          linkTool: LinkTool,
          embed: Embed,
          table: {
            class: Table,
            inlineToolbar: true,
            shortcut: 'CMD+ALT+T',
          },
          episode: {
            class: Episode,
            inlineToolbar: false,
            config: {
              endpoint: process.env.apiBaseUrl,
            },
            shortcut: 'CMD+ALT+E',
          },
          tvEvent: {
            class: TvEvent,
            inlineToolbar: false,
            config: {
              endpoint: process.env.apiBaseUrl,
            },
            shortcut: 'CMD+ALT+V',
          },
        },
        data: this.editorData,
        onChange: () => {
          this.updateEditorData()
        },
      })
    },
    updateEditorData() {
      this.editor
        .save()
        .then(outputData => {
          this.editorData = outputData
          this.$emit('modify-content', {
            sectionId: this.sectionId,
            editorData: this.editorData,
          })
        })
        .catch(error => {
          console.log('Saving failed: ', error)
        })
    },
    dumpSaveData() {
      console.log('Article data: ', JSON.stringify(this.editorData))
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
.ce-toolbox__button[data-tool='tvEvent'] {
  display: none;
}
</style>
