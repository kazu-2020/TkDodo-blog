<template>
  <div class="editor-sandbox">
    <div class="title">
      Editor.js Sandbox
    </div>
    <v-divider class="ma-2" />
    <ul>
      <li v-for="section in sections" :key="section">
        <editable-section :section-id="section" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    EditableSection: () => import('~/components/EditableSection.vue'),
  },
})
export default class SandboxComponent extends Vue {
  sections = ['editor1', 'editor2', 'editor3']
}
</script>
