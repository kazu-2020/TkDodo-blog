<template>
  <!-- Editor.js 側で直接入力のタグはエスケープされます -->
  <!-- eslint-disable vue/no-v-html -->
  <compnent :is="tag" class="article-list">
    <li
      v-for="(item, index) in items"
      :key="`${listStyle}-${index}`"
      v-html="item"
    />
  </compnent>
  <!-- eslint-enable vue/no-v-html -->
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'List',
  props: {
    listStyle: {
      type: String,
      default: 'unordered',
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    tag() {
      if (this.listStyle === 'unordered') {
        return 'ul'
      } else if (this.listStyle === 'ordered') {
        return 'ol'
      } else {
        return 'ul'
      }
    },
  },
})
</script>

<style lang="scss">
ul.article-list,
ol.article-list {
  color: #4a4a4a;

  margin: 10px 0 20px;
  color: #4a4a4a;
  font-size: 16px;
  line-height: 1.6;

  .cdx-marker {
    background: rgba(245, 235, 111, 0.45);
    padding: 3px 0;
  }

  mark {
    color: #000;
  }

  a {
    font-weight: bold;
    text-decoration: underline;
    transition: 0.3s;
  }
}
</style>
