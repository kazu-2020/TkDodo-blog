<template>
  <hr class="article-delimiter" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Delimiter',
})
</script>

<style lang="scss">
hr.article-delimiter {
  margin-top: 20px;
  margin-bottom: 20px;
  border: 0;
  border-top: 1px solid #eeeeee;
}
</style>
