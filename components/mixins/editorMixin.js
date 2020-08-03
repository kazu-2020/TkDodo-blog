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
import Undo from 'editorjs-undo'

// Original Plugins
import Episode from '~/plugins/editorjs/episode.js'
import TvEvent from '~/plugins/editorjs/tv_event.js'
import HowTo from '~/plugins/editorjs/howto.js'
import Recipe from '~/plugins/editorjs/recipe.js'

const editorMixin = {
  mounted() {
    this.doEditor()
  },
  methods: {
    doEditor() {
      this.editor = new EditorJS({
        holder: this.editorId,
        logLevel: 'WARN',
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
          howTo: {
            class: HowTo,
            inlineToolbar: false,
            config: {
              endpoint: process.env.apiBaseUrl,
            },
          },
          recipe: {
            class: Recipe,
            inlineToolbar: false,
            config: {
              endpoint: process.env.apiBaseUrl,
            },
          },
        },
        data: this.editorData,
        onChange: () => {
          this.updateEditorData()
        },
        onReady: () => {
          new Undo({ editor: this.editor }) // eslint-disable-line no-new
          this.initializeEditor()
        },
      })
    },
  },
}

export default editorMixin
