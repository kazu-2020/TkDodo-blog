<template>
  <v-row>
    <v-col
      v-for="(citation, index) in citations"
      :key="`citation-${index}`"
      cols="12"
      class="pa-0"
    >
      <citation-form
        :citation="citation"
        :citation-index="index"
        @update-name="updateName"
        @update-url="updateUrl"
        @remove-citation="removeCitation"
      />
    </v-col>
    <v-col cols="12">
      <v-btn class="mr-4" @click="addCitation">
        <v-icon>mdi-plus</v-icon>
        関連リンクを追加
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import CitationForm from '~/components/playlists/CitationForm.vue'

export default Vue.extend({
  name: 'CitationsForm',
  components: {
    CitationForm,
  },
  props: {
    citations: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    addCitation(): void {
      this.$emit(
        'update:citations',
        this.citations.slice().concat([{ name: '', url: '', _destroy: 0 }])
      )
    },
    removeCitation(citation: any): void {
      const newCitations = this.citations.slice()
      newCitations.splice(citation.citationIndex, 1, citation)

      const that = this as any
      that.$emit('update:citations', newCitations)
    },
    updateName(citation: any): void {
      const newCitations = this.citations.slice()
      newCitations.splice(citation.citationIndex, 1, citation)

      const that = this as any
      that.$emit('update:citations', newCitations)
    },
    updateUrl(citation: any): void {
      const newCitations = this.citations.slice()
      newCitations.splice(citation.citationIndex, 1, citation)

      const that = this as any
      that.$emit('update:citations', newCitations)
    },
  },
})
</script>

<style lang="scss" scoped></style>
