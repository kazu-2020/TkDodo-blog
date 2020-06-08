<template>
  <!-- Editor.js 側で直接入力のタグはエスケープされます -->
  <!-- eslint-disable vue/no-v-html -->
  <p class="article-paragraph" v-html="text" />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Paragraph',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
})
</script>

<style lang="scss">
p.article-paragraph {
  margin: 0;
  margin-top: 10px;
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
