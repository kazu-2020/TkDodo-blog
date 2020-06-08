<template>
  <v-navigation-drawer
    v-model="drawer"
    absolute
    temporary
    right
    width="600"
    height="500"
  >
    <v-list-item>
      <v-list-item-title>Preview</v-list-item-title>
    </v-list-item>
    <v-divider />
    <div class="preview-area">
      <div
        v-for="(block, index) in previewJson.blocks"
        :key="`${block.type}-${index}`"
      >
        <Heading v-if="block.type === 'header'" :level="block.data.level">
          {{ block.data.text }}
        </Heading>
        <paragraph
          v-else-if="block.type == 'paragraph'"
          :text="block.data.text"
        />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import Heading from '~/components/EditorBlocks/Heading.vue'
import Paragraph from '~/components/EditorBlocks/Paragraph.vue'

export type DataType = {
  drawer: boolean
  previewJson: object
  componentNameMap: object
}

export default Vue.extend({
  name: 'PreviewDrawer',
  components: { Heading, Paragraph },
  props: {
    isShowDrawer: {
      type: Boolean,
      default: false,
    },
    previewData: {
      type: Object,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      drawer: this.isShowDrawer,
      previewJson: this.previewData,
      componentNameMap: {
        header: 'heading',
        paragraph: 'paragraph',
      },
    }
  },
  watch: {
    isShowDrawer: {
      handler(newVal) {
        this.drawer = newVal
      },
      immediate: true,
    },
    drawer: {
      handler(newVal) {
        this.$emit('current-drawer-state', newVal)
      },
    },
  },
})
</script>

<style scoped>
.preview-area {
  background: white;
  padding: 20px;
}
</style>
