<template>
  <v-layout column>
    <v-row>
      <v-col cols="12">
        <div class="title mb-4">必ずエラーになるページ</div>
      </v-col>
      <v-col cols="12">
        <v-alert outlined type="warning"> Sentry 試験用 </v-alert>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'SamplePage',
  mounted() {
    throw new Error('Always wrong!!')
  },
})
</script>
