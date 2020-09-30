<template>
  <div class="title_block">
    <v-btn icon class="back_button" @click="pageBack">
      <v-icon>mdi-keyboard-backspace</v-icon>
    </v-btn>
    <div class="title_area">
      <div class="title mb-4">
        <h2>{{ pageTitle }}</h2>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PageTitle',
  props: {
    pageTitle: {
      type: String,
      required: false,
      default: '',
    },
  },
  methods: {
    pageBack() {
      this.$router.back()
    },
  },
})
</script>

<style scoped>
.title_block {
  display: table;
  position: relative;
}

.back_button {
  display: table-cell;
  position: absolute;
  top: 0;
}

.title_area {
  display: table-cell;
  position: relative;
  left: 40px;
  top: 4px;
}
</style>
