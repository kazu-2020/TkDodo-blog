<template>
  <div class="iconed_title_block">
    <v-icon class="icon pr-4">{{ icon }}</v-icon>
    <h3 class="iconed_title">{{ title }}</h3>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'IconedTitle',
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
})
</script>

<style scoped>
.iconed_title_block {
  display: table;
  position: relative;
}

.icon {
  display: table-cell;
}

.iconed_title {
  display: table-cell;
}
</style>
