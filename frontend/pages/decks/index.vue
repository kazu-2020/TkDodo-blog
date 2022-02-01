<template>
  <v-layout column>
    <v-row justify="center">
      <v-col cols="11">
        <v-row justify="space-between">
          <v-col cols="6">
            <div class="title mb-4 pt-2">デッキ一覧</div>
            <v-text-field
              v-model="searchKeyword"
              label="デッキタイトル・管理メモで検索"
              prepend-inner-icon="mdi-magnify"
              solo
              class="deck-search"
              hide-details
              clearable
              @keypress.enter="searchDecktWithKeyword"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="totalPages > 1">
      <v-col cols="12">
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="totalPages"
            :total-visible="totalVisiblePagination"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          />
        </div>
      </v-col>
    </v-row>
    <v-row v-else justify="center">
      <v-col v-for="deck in decks" :key="deck.id" cols="11" class="py-1">
        <simple-deck-item :deck="deck" />
      </v-col>
    </v-row>
    <v-row v-if="totalPages > 1">
      <v-col cols="12">
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="totalPages"
            :total-visible="totalVisiblePagination"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          />
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="isShowLoadingDialog" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text class="pt-2">
          読込中...
          <v-progress-linear indeterminate color="white" class="mb-0 mt-2" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import SimpleDeckItem from '~/components/decks/SimpleDeckItem.vue'

interface DataType {
  page: number
  totalVisiblePagination: number
  selectedApiStateFilter: string
  searchKeyword: string | undefined
  isShowLoadingDialog: boolean
}

export default Vue.extend({
  name: 'DeckIndexPage',
  components: { SimpleDeckItem },
  async asyncData({ store }) {
    await store.dispatch('decks/fetchDecks', {
      page: 1,
    })
  },
  data(): DataType {
    return {
      page: 1,
      totalVisiblePagination: 9,

      selectedApiStateFilter: 'open',
      searchKeyword: undefined,
      isShowLoadingDialog: false,
    }
  },
  computed: {
    decks() {
      return this.$store.state.decks.allDecks
    },
    totalPages() {
      return this.$store.state.decks.pagination.totalPages
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
    searchDeckWithKeyword(): void {
      // TODO: 後ほど実装する
      this.isShowLoadingDialog = true
      this.$store.dispatch('decks/fetchDecks', {
        page: 1,
        apiState: this.selectedApiStateFilter,
        query: this.searchKeyword,
      })
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
