<template>
  <compnent :is="tag">
    <slot>
      <!-- fallback content here -->
    </slot>
  </compnent>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Heading',
  props: {
    level: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    tag() {
      return `h${this.level}`
    },
  },
})
</script>
