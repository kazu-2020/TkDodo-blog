<template>
  <div class="hoge">
    <div id="codex-editor" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import EditorJS from '@editorjs/editorjs'

@Component
export default class PlaylisticleSandbox extends Vue {
  editor?: object = {}

  doEditor() {
    this.editor = new EditorJS({
      holder: 'codex-editor',
    })
  }

  mounted() {
    this.doEditor()
  }
}
</script>
