<template>
  <v-layout column style="position: relative">
    <div class="fixed-row-wrapper">
      <v-row class="fixed-row pt-2 pr-15" justify="space-between">
        <v-col cols="12" class="pt-8">
          <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
            <template #item="{ item }">
              <v-breadcrumbs-item :href="item.href" :disabled="item.disabled">
                {{ item.text }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </v-col>
        <v-col cols="9">
          <deck-stepper
            :current="currentTab"
            :deck-tab-validation="isValidDeckTab"
            :has-unsaved-playlists="hasUnsavedPlaylist"
            :has-unsaved-deck="hasUnsavedDeck"
            @change-tab="changeTab"
          />
        </v-col>
        <v-spacer />
        <v-col cols="2" class="">
          <v-btn
            x-large
            block
            elevation="0"
            color="accent"
            :disabled="preventSaveButton"
            @click="clickSaveButton"
          >
            保存する
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-show="isPlaylistsEditing"
          cols="9"
          lg="9"
          xl="9"
          md="12"
          sm="12"
          class="mt-4 list-item-container-wrapper"
        >
          <series-deck-playlists-edit-tab
            :deck="deck"
            @update-playlists="updatePlaylists"
            @add-playlist="addPlaylist"
            @delete-playlist="deletePlaylist"
          />
        </v-col>
        <v-col
          v-show="isDeckEditing"
          cols="9"
          lg="9"
          xl="9"
          md="12"
          sm="12"
          class="mt-4 series-container-wrapper"
        >
          <series-deck-meta-edit-tab
            :deck="deck"
            @update-deck="updateDeck"
            @update-validation="updateDeckTabValidation"
            @change-deck-interfix="changeDeckInterfix"
          />
        </v-col>
        <v-col cols="3" class="preview-container-wrapper hidden-md-and-down">
          <div
            class="preview-container container-fluid mt-4 pa-2 white rounded"
          >
            <div
              class="base-information pa-3 rounded"
              style="border: 1px solid #d3d3d3"
            >
              <v-row>
                <v-col cols="6" class="pr-0">
                  <h2 class="deck-name">{{ deck.name }}</h2>
                </v-col>
                <v-col
                  v-if="deckDescription"
                  cols="12"
                  class="body-2 py-2"
                  style="word-wrap: break-word"
                >
                  <div class="body-3 font-weight-bold mb-2">説明</div>
                  {{ deckDescription }}
                </v-col>
              </v-row>
            </div>
            <v-divider />
            <v-col cols="12">
              <div class="body-2 font-weight-bold">プレイリスト</div>
              <v-list dense>
                <v-list-item
                  v-for="playlist in deck.playlists"
                  :key="`${playlist.seriesId}-preview`"
                  class="px-0 pb-2"
                >
                  <v-list-item-icon class="mr-3">
                    <v-img
                      :src="logoUrl(playlist)"
                      lazy-src="https://placehold.jp/50x50.png"
                      width="50"
                      height="50"
                    />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      style="font-size: 14px"
                      class="pt-4"
                      v-text="playlist.name"
                    />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Deck } from '~/types/deck'
import { DeckTab } from '~/models/definitions'
import DeckStepper from '~/components/decks/DeckStepper.vue'
import SeriesDeckPlaylistsEditTab from '~/components/seriesDecks/SeriesDeckPlaylistsEditTab.vue'
import SeriesDeckMetaEditTab from '~/components/seriesDecks/SeriesDeckMetaEditTab.vue'
import unloadAlertMixin from '~/components/common/unloadAlertMixin'

interface Breadcrumb {
  text: string
  disabled: boolean
  href: string
}

interface DataType {
  currentTab: DeckTab
  hasUnsavedPlaylist: boolean
  hasUnsavedDeck: boolean
  isValidDeckTab: boolean
  isChangeDeckInterfix: boolean
}

export default Vue.extend({
  components: {
    DeckStepper,
    SeriesDeckPlaylistsEditTab,
    SeriesDeckMetaEditTab,
  },
  mixins: [unloadAlertMixin],
  async asyncData({ store, params, error }) {
    await store.dispatch('decks/fetchSeriesDeck', params.id).catch((e) => {
      if (e.response.status === 404) {
        error({ statusCode: 404, message: e.response.data.messages })
      }
    })
  },
  data(): DataType {
    return {
      currentTab: DeckTab.playlists,
      hasUnsavedPlaylist: false,
      hasUnsavedDeck: false,
      isValidDeckTab: true,
      isChangeDeckInterfix: false,
    }
  },
  computed: {
    deck(): Deck {
      return this.$store.state.decks.editingDeck
    },
    isPlaylistsEditing(): boolean {
      return this.currentTab === DeckTab.playlists
    },
    isDeckEditing(): boolean {
      return this.currentTab === DeckTab.deck
    },
    breadcrumbItems(): Breadcrumb[] {
      return [
        {
          text: 'シリーズデッキ一覧',
          disabled: false,
          href: '/series_decks',
        },
        {
          text: this.deck.name,
          disabled: true,
          href: '#',
        },
      ]
    },
    preventSaveButton(): boolean {
      return !this.isValidDeckTab
    },
    deckDescription(): string | undefined {
      return this.deck?.description
    },
  },
  mounted() {
    ;(this as any).notShowUnloadAlert()
  },
  methods: {
    changeTab(nextTab: DeckTab) {
      this.currentTab = nextTab
    },
    resetUnloadAlert(): void {
      if (this.currentTab !== DeckTab.playlists) return
      ;(this as any).showUnloadAlert()
      this.hasUnsavedPlaylist = true
    },
    updateDeckTabValidation(valid: boolean) {
      this.isValidDeckTab = valid
    },
    changeDeckInterfix() {
      this.isChangeDeckInterfix = true
    },
    updateDeck(deck: any) {
      if (this.currentTab === DeckTab.deck) {
        ;(this as any).showUnloadAlert()
        this.hasUnsavedDeck = true
      }
      this.$store.dispatch('decks/updateEditingDeck', deck)
    },
    updatePlaylists(playlists: any) {
      this.resetUnloadAlert()
      this.$store.dispatch('decks/updateEditingDeckPlaylists', playlists)
    },
    addPlaylist(playlist: any) {
      this.resetUnloadAlert()
      this.$store.dispatch('decks/addEditingDeckPlaylist', playlist)
    },
    deletePlaylist(playlist: any) {
      this.resetUnloadAlert()
      this.$store.dispatch('decks/deleteEditingDeckPlaylist', playlist)
    },
    logoUrl(item: any): string {
      if (item?.logo !== undefined) {
        return item.logo.medium.url
      } else if (item?.partOfSeries?.logo !== undefined) {
        return item.partOfSeries.logo.medium.url
      }

      return 'https://placehold.jp/50x50.png'
    },
    clickSaveButton() {
      if (this.isChangeDeckInterfix) {
        const message =
          'deckId の値に変更がありました。保存してもよろしいですか？'
        if (window.confirm(message)) {
          this.save()
        }
      } else {
        this.save()
      }
    },
    save() {
      const body: { [key: string]: string | undefined } = {
        name: this.deck.name,
        description: this.deck.description,
        interfix: this.deck.interfix,
      }

      const data = new FormData()

      // このパラメーターを有効にすることで、SeriesDecks#update でプレイリストの更新もできるようにする
      data.append('enable_list_update', '1')

      for (const key in body) {
        if (body[key] !== null && body[key] !== undefined) {
          data.append(`series_deck[${key}]`, body[key] as string)
        }
      }

      if (this.deck.playlists.length > 0) {
        for (const playlist of this.deck.playlists) {
          data.append('series_deck[playlists][]', (playlist as any).seriesId)
        }
      }

      this.$store.dispatch('loading/startLoading', {
        success: '保存しました',
        error: '保存失敗しました',
      })

      this.$axios
        .put(`/series_decks/${this.deck.id}`, data)
        .then((response) => {
          this.$store.dispatch('loading/succeedLoading')
          this.$store.dispatch(
            'decks/setEditingDeck',
            (response as any).data.deck
          )

          this.$store.subscribeAction({
            after: (action, _state) => {
              if (action.type !== 'decks/setEditingDeck') return
              ;(this as any).notShowUnloadAlert()
            },
          })

          this.hasUnsavedPlaylist = false
          this.hasUnsavedDeck = false
          this.isChangeDeckInterfix = false
        })
        .catch((_error) => {
          this.$store.dispatch('loading/failLoading')
        })
    },
  },
})
</script>

<style lang="scss" scoped>
.deck-name {
  font-size: 16px;
  font-weight: bold;
}
</style>
