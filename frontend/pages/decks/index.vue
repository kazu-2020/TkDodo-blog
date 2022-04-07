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
        <simple-deck-item :deck="deck" @click-deck-item="clickDeckItem" />
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
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      right
      hide-overlay
      :width="drawerWidth"
      style="position: fixed"
    >
      <v-row class="py-4 px-6">
        <v-col cols="4">
          <div class="title">{{ selectedDeckName }}</div>
        </v-col>
        <v-col cols="3">
          <deck-api-state-badge :deck="selectedDeck" />
        </v-col>
        <v-col cols="auto">
          <v-chip class="my-1" color="primary" small @click="copyDeckStringId">
            {{ selectedDeckStringId }}
          </v-chip>
        </v-col>
        <v-col cols="12">
          {{ selectedDeckDescription }}
        </v-col>
        <v-col cols="12">
          <v-btn
            :to="{
              name: 'decks-id-adminConfig',
              params: { id: selectedDeckId },
            }"
            nuxt
            depressed
            class="edit_button mr-3"
            style="color: #5b5b5b"
          >
            <v-icon left>mdi-cog</v-icon>
            管理設定
          </v-btn>
          <v-btn
            :to="{
              name: 'decks-id',
              params: { id: selectedDeckId },
            }"
            nuxt
            depressed
            color="orange"
            class="edit_button"
            style="color: white"
          >
            <v-icon left>mdi-pencil</v-icon>
            デッキ編集
          </v-btn>
          <v-btn
            class="delete_button mr-2 float-right"
            outlined
            style="color: #5b5b5b"
            @click="deleteSelectedDeck"
          >
            <v-icon left>mdi-delete</v-icon>
            削除する
          </v-btn>
        </v-col>
        <v-col cols="12">
          <div class="subtitle-1">プレイリスト</div>
          <deck-playlist-previewer :deck="selectedDeck" />
        </v-col>
      </v-row>
    </v-navigation-drawer>
    <v-dialog v-model="isShowLoadingDialog" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text class="pt-2">
          読込中...
          <v-progress-linear indeterminate color="white" class="mb-0 mt-2" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" timeout="2000">
      コピーしました
      <template #action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          閉じる
        </v-btn>
      </template>
    </v-snackbar>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import SimpleDeckItem from '~/components/decks/SimpleDeckItem.vue'
import DeckPlaylistPreviewer from '~/components/decks/DeckPlaylistPreviewer.vue'
import { Playlist } from '~/types/playlist'
import { Deck } from '~/types/deck'
import DeckApiStateBadge from '~/components/decks/DeckApiStateBadge.vue'

interface DataType {
  drawer: boolean
  width: number
  page: number
  selectedDeck: Deck | undefined
  selectedDeckPlaylists: Playlist[]
  totalVisiblePagination: number
  selectedApiStateFilter: string
  searchKeyword: string | undefined
  isShowLoadingDialog: boolean
  snackbar: boolean
}

export default Vue.extend({
  name: 'DeckIndexPage',
  components: {
    SimpleDeckItem,
    DeckPlaylistPreviewer,
    DeckApiStateBadge,
  },
  async asyncData({ store }) {
    await store.dispatch('decks/fetchDecks', {
      page: 1,
    })
  },
  data(): DataType {
    return {
      drawer: false,
      width: window.innerWidth,
      page: 1,
      totalVisiblePagination: 9,
      selectedApiStateFilter: 'open',
      searchKeyword: undefined,
      isShowLoadingDialog: false,
      selectedDeck: undefined,
      selectedDeckPlaylists: [],
      snackbar: false,
    }
  },
  computed: {
    decks() {
      return this.$store.state.decks.allDecks
    },
    totalPages() {
      return this.$store.state.decks.pagination.totalPages
    },
    drawerWidth(): number {
      const halfSize = this.width * 0.95
      return Math.min(halfSize, 720)
    },
    selectedDeckName(): string {
      return this.selectedDeck?.name || ''
    },
    selectedDeckDescription(): string {
      return this.selectedDeck?.description || ''
    },
    selectedDeckId(): string {
      return this.selectedDeck?.id || ''
    },
    selectedDeckStringId(): string {
      return this.selectedDeck?.stringId || ''
    },
  },
  methods: {
    copyDeckStringId(): void {
      if (navigator.clipboard && this.selectedDeck?.stringId) {
        navigator.clipboard.writeText(this.selectedDeck.stringId)
        this.snackbar = true
      }
    },
    deleteSelectedDeck(): void {
      const message = '削除したデッキは復元できません。本当に削除しますか？'
      if (window.confirm(message)) {
        this.$store.dispatch('loading/startLoading', {
          success: '削除しました',
          error: '削除失敗しました',
        })
        this.$store.dispatch('decks/deleteDeck', this.selectedDeck)
        this.drawer = false
      }
    },
    searchDecktWithKeyword(): void {
      this.isShowLoadingDialog = true
      this.$store.dispatch('decks/fetchDecks', {
        page: 1,
        apiState: this.selectedApiStateFilter,
        query: this.searchKeyword,
      })
    },
    clickDeckItem(deck: any) {
      this.drawer = true
      this.selectedDeckPlaylists = []
      this.selectedDeck = deck
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
