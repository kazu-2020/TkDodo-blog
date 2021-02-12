<template>
  <v-chip small :color="publishedStateColor" :class="textColor">{{
    publishedState
  }}</v-chip>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'PublishedStateBadge',
  props: {
    playlist: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  computed: {
    publishedState(): string {
      return this.playlist?.publishedState === 'draft' ? '下書き' : '非公開'
    },
    publishedStateColor(): string {
      return this.playlist?.publishedState === 'draft' ? 'blue-grey' : 'grey'
    },
    textColor(): string {
      return this.playlist?.publishedState === 'draft'
        ? 'white--text'
        : 'black--text'
    },
  },
})
</script>
