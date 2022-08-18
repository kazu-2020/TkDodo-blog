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
      </v-row>
      <v-row class="container-fluid white rounded px-5 py-2">
        <v-col cols="12">
          <div class="title">{{ deckName }}</div>
        </v-col>
        <v-col cols="12">
          <div class="button mb-2">公開状態</div>
          <deck-api-state-badge :deck="deck" />
        </v-col>
        <v-col cols="12">
          <div class="button mb-2">管理メモ</div>
          <v-text-field v-model="adminMemo" maxlength="255" />
        </v-col>
        <v-col cols="2">
          <v-btn x-large block elevation="0" color="accent" @click="save">
            保存する
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Deck } from '~/types/deck'
import DeckApiStateBadge from '~/components/decks/DeckApiStateBadge.vue'

interface Breadcrumb {
  text: string
  disabled: boolean
  href: string
}

export default Vue.extend({
  name: 'DeckAdminConfig',
  components: {
    DeckApiStateBadge,
  },
  async asyncData({ store, params, error }) {
    await store
      .dispatch('decks/fetchDeck', {
        targetId: params.id,
        withEpisodeCount: 100,
      })
      .catch((e) => {
        if (e.response.status === 404) {
          error({ statusCode: 404, message: e.response.data.messages })
        }
      })
  },
  computed: {
    breadcrumbItems(): Breadcrumb[] {
      return [
        {
          text: 'デッキ一覧',
          disabled: false,
          href: '/decks',
        },
        {
          text: `[管理設定]${this.deck.name}`,
          disabled: true,
          href: '#',
        },
      ]
    },
    deck(): Deck {
      return this.$store.state.decks.editingDeck
    },
    deckName(): string {
      return this.deck?.name || ''
    },
    adminMemo: {
      get() {
        return (this as any).deck.adminMemo
      },
      set(newVal) {
        const originalDeck = Object.assign({}, (this as any).deck)
        const deck = Object.assign(originalDeck, { adminMemo: newVal })

        this.$store.dispatch('decks/updateEditingDeck', deck)
      },
    },
  },
  methods: {
    save() {
      const body: { [key: string]: string | undefined } = {
        admin_memo: this.adminMemo,
      }

      const data = new FormData()

      for (const key in body) {
        if (body[key] !== null && body[key] !== undefined) {
          data.append(`deck[${key}]`, body[key] as string)
        }
      }

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
        })
        .catch((_error) => {
          this.$store.dispatch('loading/failLoading')
        })
    },
  },
})
</script>
