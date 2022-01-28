<template>
  <v-chip small :color="apiStateColor" :class="textColor">{{
    apiState
  }}</v-chip>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ApiStateBadge',
  props: {
    playlist: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  computed: {
    apiState(): string {
      return this.playlist?.apiState === 'open' ? '公開' : '非公開'
    },
    apiStateColor(): string {
      return this.playlist?.apiState === 'open' ? 'blue-grey' : 'grey'
    },
    textColor(): string {
      return this.playlist?.apiState === 'open' ? 'white--text' : 'black--text'
    },
  },
})
</script>
