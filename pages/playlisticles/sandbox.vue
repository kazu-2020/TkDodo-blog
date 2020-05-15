<template>
  <div class="editor-sandbox">
    <div class="title">
      Editor.js Sandbox
    </div>
    <v-divider class="ma-2" />
    <div id="codex-editor" />
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

export default {
  data() {
    return {
      editor: {},
    }
  },
  mounted() {
    this.doEditor()
  },
  methods: {
    doEditor() {
      this.editor = new EditorJS({
        holder: 'codex-editor',
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
        },
      })
    },
  },
}
</script>
