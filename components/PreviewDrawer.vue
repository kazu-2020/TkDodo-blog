<template>
  <v-navigation-drawer
    v-model="drawer"
    absolute
    temporary
    right
    width="600"
    height="696"
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
        <heading v-if="block.type === 'header'" :level="block.data.level">
          {{ block.data.text }}
        </heading>
        <paragraph
          v-else-if="block.type === 'paragraph'"
          :text="block.data.text"
        />
        <list
          v-else-if="block.type === 'list'"
          :list-style="block.data.style"
          :items="block.data.items"
        />
        <delimiter v-else-if="block.type == 'delimiter'" />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import Heading from '~/components/EditorBlocks/Heading.vue'
import Paragraph from '~/components/EditorBlocks/Paragraph.vue'
import List from '~/components/EditorBlocks/List.vue'
import Delimiter from '~/components/EditorBlocks/Delimiter.vue'

export type DataType = {
  drawer: boolean
  previewJson: object
}

export default Vue.extend({
  name: 'PreviewDrawer',
  components: { Heading, Paragraph, List, Delimiter },
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
