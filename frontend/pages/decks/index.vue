<template>
  <v-layout column>
    <v-row justify="center">
      <v-col cols="11">
        <v-row justify="space-between">
          <v-col cols="6">
            <div class="title mb-4 pt-2">デッキ一覧</div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="11">
        <v-tabs
          v-model="currentTab"
          show-arrows
          class="deck_tabs"
          slider-color="rgba(255, 255, 255, 0)"
        >
          <v-tab
            v-for="deck in decks"
            :key="deck.name"
            :href="'#tab-' + deck.id"
          >
            <v-chip class="mr-2" label color="pink" text-color="white" x-small>
              公開中
            </v-chip>
            {{ deck.name }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="currentTab">
          <v-tab-item
            v-for="deck in decks"
            :key="deck.name"
            :value="'tab-' + deck.id"
          >
            <deck-item :deck="deck" />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import DeckItem from '~/components/decks/DeckItem.vue'

interface DataType {
  currentTab: any
}

export default Vue.extend({
  name: 'DeckIndexPage',
  components: {
    DeckItem,
  },
  async asyncData({ store }) {
    await store.dispatch('decks/fetchDecks')
  },
  data(): DataType {
    return {
      currentTab: null,
    }
  },
  computed: {
    decks() {
      return this.$store.state.decks.allDecks
    },
  },
  methods: {
    deleteSelectedDeck(deckId: number): void {
      const message = '削除したデッキは復元できません。本当に削除しますか？'
      if (window.confirm(message)) {
        this.$store.dispatch('loading/startLoading', {
          success: '削除しました',
          error: '削除失敗しました',
        })
        this.$store.dispatch('decks/deleteDeck', deckId)
      }
    },
  },
})
</script>

<style>
.deck_tabs .v-tabs-bar {
  background-color: #f0f0f0 !important;
}

.deck_tabs .v-tab {
  background-color: #e1e1e1;
}

.deck_tabs .v-tab--active {
  background-color: white;
}
</style>
