<template>
  <v-row v-if="!isDestroyed" class="py-0 px-4">
    <v-col cols="5">
      <v-text-field
        v-model="name"
        :rules="nameRules"
        label="名前"
        class="citation-name"
      />
    </v-col>
    <v-col cols="5">
      <v-text-field
        v-model="url"
        :rules="urlRules"
        label="URL"
        class="citation-url"
      />
    </v-col>
    <v-col cols="1">
      <v-btn color="error" class="mr-4" @click="removeCitation">削除</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
  nameRules: Array<Function>
  urlRules: Array<Function>
}

export default Vue.extend({
  name: 'CitationForm',
  props: {
    citation: {
      type: Object,
      required: true,
      default: () => {},
    },
    citationIndex: {
      type: Number,
      required: true,
    },
  },
  data(): DataType {
    return {
      nameRules: [
        (v: String) => !!v || '名前は必ず入力してください',
        (v: String) =>
          (v && v.length <= 255) || '名前は255文字以下で入力してください',
      ],
      urlRules: [
        (v: String) => !!v || 'URLは必ず入力してください',
        (v: String) =>
          (v && v.length <= 255) || 'URLは255文字以下で入力してください',
      ],
    }
  },
  computed: {
    isDestroyed(): boolean {
      return (this.citation as any)._destroy === 1
    },
    name: {
      get() {
        return (this as any).citation.name
      },
      set(value) {
        const that = this as any
        that.$emit('update-name', {
          citationIndex: that.citationIndex,
          id: that.citation.id,
          name: value,
          url: that.citation.url,
          _destroy: 0,
        })
      },
    },
    url: {
      get() {
        return (this as any).citation.url
      },
      set(value) {
        const that = this as any
        that.$emit('update-url', {
          citationIndex: that.citationIndex,
          id: that.citation.id,
          name: that.citation.name,
          url: value,
          _destroy: 0,
        })
      },
    },
  },
  methods: {
    removeCitation(): void {
      const that = this as any
      this.$emit('remove-citation', {
        citationIndex: that.citationIndex,
        id: that.citation.id,
        name: null,
        url: null,
        _destroy: 1,
      })
    },
  },
})
</script>

<style lang="scss" scoped></style>
