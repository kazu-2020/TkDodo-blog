import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import LinkTool from '@editorjs/link'
import Embed from '@editorjs/embed'
import Undo from 'editorjs-undo'

// Original Plugins
import MultiTypeEpisode from '~/plugins/editorjs/multi_type_episode/index.js'

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
            config: {
              placeholder: '見出しを入力してください',
              levels: [2],
              defaultLevel: 2,
            },
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+L',
          },
          linkTool: LinkTool,
          embed: Embed,
          multiTypeEpisode: {
            class: MultiTypeEpisode,
            inlineToolbar: false,
            config: {
              endpoint: process.env.apiBaseUrl,
              playlistId: this.playlistId,
            },
            shortcut: 'CMD+ALT+E',
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
