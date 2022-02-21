<template>
  <div
    class="mx-auto pa-2"
    style="background-color: white; border-radius: 4px; cursor: pointer"
    outlined
    light
    @click="clickDeckItem"
  >
    <v-row>
      <v-col cols="4">
        <v-img
          :src="logoImageUrl"
          class="deck_logo_image mr-3 elevation-3 float-left"
          aspect-ratio="1"
          height="30"
          width="30"
        />
        <div class="title">
          <a class="deck-title">
            <span class="deck-name">{{ deckName }}</span>
          </a>
        </div>
      </v-col>
      <v-col cols="3">
        <v-chip label small color="pink" class="white--text">公開中</v-chip>
      </v-col>
      <v-col cols="5">{{ deckAdminMemo }}</v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import moment from 'moment'

export default Vue.extend({
  name: 'SimpleDeckItem',
  props: {
    deck: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  computed: {
    deckName(): string {
      const name = this.deck.name || ''
      return name.length > 26 ? name.substr(0, 26) + '…' : name
    },
    deckAdminMemo(): string {
      return this.deck.adminMemo || ''
    },
    logoImageUrl(): string {
      return this.deck.logo?.medium?.url || this.dummyImage
    },
    dummyImage(): string {
      const logoNumber = this.deck.dateCreated
        ? (Number(moment(this.deck.dateCreated).format('DD')) % 10) + 1
        : 1
      return `/dummy/default${logoNumber}/default${logoNumber}-logo.png`
    },
  },
  methods: {
    clickDeckItem(): void {
      this.$emit('click-deck-item', this.deck)
    },
  },
})
</script>
<style scoped>
.deck-title .deck-name {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.7rem;
}

.deck_logo_block {
  width: 30%;
  cursor: pointer;
}

.deck_logo_image {
  width: 100%;
  border-radius: 4px;
}

.clearfix::after {
  content: '';
  display: block;
  clear: both;
}
</style>
