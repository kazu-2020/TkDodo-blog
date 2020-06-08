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

<style scoped>
h1 {
  color: #333;
  font-size: 30px;
  font-weight: 700;
  margin: 10px 0 0;
}

h2 {
  color: #333;
  font-size: 18px;
  font-weight: 700;
  margin: 10px 0 0;
}

h3 {
  color: #333;
  font-size: 16px;
  font-weight: 700;
  margin: 10px 0 0;
}

h4 {
  color: #333;
  font-size: 12px;
  font-weight: 700;
  margin: 10px 0 0;
}
</style>
