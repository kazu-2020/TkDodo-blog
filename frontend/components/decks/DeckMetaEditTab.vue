<template>
  <div class="series-container container-fluid white rounded px-5 py-2">
    <v-row>
      <v-col cols="12">
        <v-form ref="form" v-model="valid">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="名前 - Name"
                class="deck_name"
                required
              />
            </v-col>
            <v-col cols="12">
              <span class="mr-2">recommend-tv-for-</span>
              <v-text-field
                v-model="interfix"
                :rules="interfixRules"
                label="中間接辞  - Interfix"
                class="deck_name d-inline-block mr-2"
                required
              />
              <span>-{{ primaryId }}</span>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="description"
                name="catch"
                rows="5"
                label="説明 - Description"
                class="description"
                counter
              />
            </v-col>
          </v-row>

          <!-- sameAs -->
          <v-row dense class="my-5">
            <v-col cols="12">
              <h3 class="mb-3">
                リンク(同一内容)<small class="text--secondary"> - SameAs</small>
              </h3>
            </v-col>
            <same-as-form :same-as.sync="sameAs" />
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SameAsForm from '~/components/playlists/SameAsForm.vue'

interface DataType {
  name: string
  interfix: string
  description: string
  sameAs: Object[]
  valid: boolean
  nameRules: Function[]
  interfixRules: Function[]
}

export default Vue.extend({
  name: 'DeckMetaEditTab',
  components: {
    SameAsForm,
  },
  props: {
    deck: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      name: this.deck.name || '',
      interfix: this.deck.interfix || '',
      description: this.deck.description || '',
      sameAs: this.deck.sameAs || [],
      valid: true,
      nameRules: [
        (v: string) => !!v || '名前は必ず入力してください',
        (v: string) =>
          (v && v.length <= 255) || '名前は255文字以下で入力してください',
      ],
      interfixRules: [
        (v: string) => !!v || '中間接辞は必ず入力してください',
        (v: string) =>
          (v && v.length <= 255) || '中間接辞は255文字以下で入力してください',
      ],
    }
  },
  computed: {
    primaryId(): string {
      if (this.deck.id !== undefined) {
        return ('0000000000' + this.deck.id).slice(-10)
      }
      return 'xxxxxxxxxx'
    },
  },
  watch: {
    deck: {
      handler(newVal) {
        this.name = newVal.name
        this.description = newVal.description
        this.interfix = newVal.interfix
        this.sameAs = newVal.sameAs
      },
      deep: true,
    },
    name: {
      handler(newVal) {
        if (this.deck.name === newVal) return
        const originalDeck = Object.assign({}, (this as any).deck)
        const deck = Object.assign(originalDeck, { name: newVal })
        this.$emit('update-deck', deck)
      },
    },
    description: {
      handler(newVal) {
        if (this.deck.description === newVal) return
        const originalDeck = Object.assign({}, (this as any).deck)
        const deck = Object.assign(originalDeck, {
          description: newVal,
        })
        this.$emit('update-deck', deck)
      },
    },
    interfix: {
      handler(newVal) {
        if (this.deck.interfix === newVal) return
        const originalDeck = Object.assign({}, (this as any).deck)
        const deck = Object.assign(originalDeck, { interfix: newVal })
        this.$emit('update-deck', deck)
      },
    },
    sameAs: {
      handler(newVal) {
        if (this.deck.sameAs === newVal) return
        const originalDeck = Object.assign({}, (this as any).deck)
        const deck = Object.assign(originalDeck, { sameAs: newVal })
        this.$emit('update-deck', deck)
      },
    },
    valid: {
      handler(newValue) {
        this.$emit('update-validation', newValue)
      },
    },
  },
  methods: {
    validate() {
      const form: any = this.$refs.form
      form.validate()
    },
  },
})
</script>
