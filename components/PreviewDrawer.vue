<template>
  <v-navigation-drawer
    v-model="drawer"
    absolute
    temporary
    right
    width="800"
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
        <delimiter v-else-if="block.type === 'delimiter'" />
        <episode
          v-else-if="block.type === 'episode'"
          :episode="block.data.episode"
        />
        <tv-event
          v-else-if="block.type === 'tvEvent'"
          :event-data="block.data.tvEvent"
          :series-data="block.data.tvSeries"
        />
        <recipe
          v-else-if="block.type === 'recipe'"
          :recipe-data="block.data.recipe"
          :series-data="block.data.tvSeries"
        />
        <how-to
          v-else-if="block.type === 'howTo'"
          :how-to-data="block.data.howTo"
          :series-data="block.data.tvSeries"
        />
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
import Episode from '~/components/EditorBlocks/Episode.vue'
import TvEvent from '~/components/EditorBlocks/TvEvent.vue'
import Recipe from '~/components/EditorBlocks/Recipe.vue'
import HowTo from '~/components/EditorBlocks/HowTo.vue'

export type DataType = {
  drawer: boolean
  previewJson: object
}

export default Vue.extend({
  name: 'PreviewDrawer',
  components: {
    Heading,
    Paragraph,
    List,
    Delimiter,
    Episode,
    TvEvent,
    Recipe,
    HowTo,
  },
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
