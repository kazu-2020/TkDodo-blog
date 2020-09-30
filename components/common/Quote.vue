<template>
  <div class="article-quote">
    <blockquote :style="{ textAlign: alignment }">
      <!-- Editor.js 側で直接入力のタグはエスケープされます -->
      <!-- eslint-disable vue/no-v-html -->
      <p v-html="text" />
      <!-- eslint-enable vue/no-v-html -->
    </blockquote>
    <div class="quote-caption">
      {{ caption }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Quote',
  props: {
    text: {
      type: String,
      default: '',
    },
    alignment: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
  },
  computed: {},
})
</script>

<style lang="scss">
.article-quote {
  color: #4a4a4a;
  margin-bottom: 16px;

  blockquote {
    position: relative;
    padding: 10px 15px 10px 60px;
    box-sizing: border-box;
    font-style: italic;
    background: #efefef;
    color: #555;
    border-left: 4px solid #888888;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.14);
    margin-bottom: 16px;
    font-size: 18px;
  }

  blockquote:before {
    display: inline-block;
    position: absolute;
    top: 7px;
    left: 0;
    content: '“';
    font-family: sans-serif;
    color: #888888;
    font-size: 90px;
    line-height: 1;
  }

  blockquote p {
    padding: 0;
    margin: 7px 0;
    line-height: 1.7;
  }

  blockquote cite {
    display: block;
    text-align: right;
    color: #888888;
    font-size: 0.9em;
  }

  .quote-caption {
    font-size: 16px;
  }
}
</style>
