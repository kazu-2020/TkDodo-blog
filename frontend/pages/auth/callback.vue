<template>
  <v-layout column>
    <v-row>
      <v-col> ログイン中です...</v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'AuthCallback',
  mounted() {
    setTimeout(() => {
      this.$router.push('/auth/sandbox')
    }, 1000)
  },
})
</script>
