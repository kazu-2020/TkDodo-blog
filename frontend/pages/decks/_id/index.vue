<template>
  <div>hoge</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  async asyncData({ store, params, error }) {
    await store.dispatch('decks/fetchDeck', params.id).catch((e) => {
      if (e.response.status === 404) {
        error({ statusCode: 404, message: e.response.data.messages })
      }
    })
  },
})
</script>
