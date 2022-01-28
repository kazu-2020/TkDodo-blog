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
            @click="save"
          >
            保存する
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="hidden-lg-and-up preview-container-wrapper">
          <!-- <horizontal-basic-information-view :playlist="playlist" /> -->
          information-view
        </v-col>
        <v-col
          v-show="isPlaylistsEditing"
          cols="9"
          lg="9"
          xl="9"
          md="12"
          sm="12"
          class="mt-4 list-item-container-wrapper"
        >
          <deck-playlists-edit-tab
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
          <!-- <series-meta-edit-tab
            :playlist="playlist"
            @update-series="updateSeries"
            @update-validation="updateSeriesTabValidation"
          /> -->
          deck
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
import DeckPlaylistsEditTab from '~/components/decks/DeckPlaylistsEditTab.vue'
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
}

export default Vue.extend({
  components: {
    DeckStepper,
    DeckPlaylistsEditTab,
  },
  mixins: [unloadAlertMixin],
  async asyncData({ store, params, error }) {
    await store.dispatch('decks/fetchDeck', params.id).catch((e) => {
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
          text: 'デッキ一覧',
          disabled: false,
          href: '/',
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
    save() {
      const data = new FormData()

      // このパラメーターを有効にすることで、Decks#update でプレイリストの更新もできるようにする
      data.append('enable_list_update', '1')

      if (this.deck.playlists.length > 0) {
        for (const playlist of this.deck.playlists) {
          data.append('deck[playlists][]', playlist.internalId)
        }
      }

      // for (const sameAs of this.deck.sameAs) {
      //   if (sameAs.id) {
      //     data.append('deck[same_as_attributes][][id]', sameAs.id.toString())
      //   }
      //   if (sameAs.name) {
      //     data.append('deck[same_as_attributes][][name]', sameAs.name)
      //   }
      //   if (sameAs.url) {
      //     data.append('deck[same_as_attributes][][url]', sameAs.url)
      //   }
      //   if (sameAs._destroy) {
      //     data.append(
      //       'deck[same_as_attributes][][_destroy]',
      //       sameAs._destroy.toString()
      //     )
      //   }
      // }

      this.$store.dispatch('loading/startLoading', {
        success: '保存しました',
        error: '保存失敗しました',
      })

      this.$axios
        .put(`/decks/${this.deck.id}`, data)
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
        })
        .catch((_error) => {
          this.$store.dispatch('loading/failLoading')
        })
    },
  },
})
</script>
