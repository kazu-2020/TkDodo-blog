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
        <div v-if="block.type === 'header'">
          <component :is="componentName" :level="block.data.level">
            {{ block.data.text }}
          </component>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import Heading from '~/components/Heading.vue'

export type DataType = {
  drawer: boolean
  previewJson: object
  componentName: string
}

export default Vue.extend({
  name: 'PreviewDrawer',
  components: { Heading },
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
      componentName: 'heading',
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
