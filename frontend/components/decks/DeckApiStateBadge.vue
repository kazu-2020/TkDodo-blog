<template>
  <v-chip
    v-if="deck"
    label
    small
    :color="deckApiStateColor"
    class="white--text"
    >{{ deckApiStateTitle }}</v-chip
  >
</template>

<script lang="ts">
import Vue from 'vue'
import { Deck } from '~/types/deck'

export default Vue.extend({
  props: {
    deck: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  computed: {
    deckApiStateTitle(): string {
      return (this.deck as Deck)?.apiState === 'open' ? '公開中' : '非公開'
    },
    deckApiStateColor(): string {
      return (this.deck as Deck)?.apiState === 'open' ? 'pink' : 'grey'
    },
  },
})
</script>
