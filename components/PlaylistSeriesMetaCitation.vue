<template>
  <v-row dense class="ma-4">
    <v-col cols="12">
      <v-row
        v-for="citation in citationList"
        :key="citation.id"
        justify="center"
        align="center"
      >
        <v-col cols="5">
          <v-text-field
            v-model="citation.name"
            :rules="nameRules"
            label="名前"
          />
        </v-col>
        <v-col cols="5">
          <v-text-field v-model="citation.url" :rules="nameRules" label="URL" />
        </v-col>
        <v-col cols="2">
          <v-btn color="error" class="mr-4" @click="removeCitation(citation)">
            削除
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" class="ma-2">
      <v-btn @click="addCitation">
        <v-icon>mdi-plus</v-icon>
        関連リンクを追加
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

interface Citation {
  name: string
  url: string
}

interface DataType {
  citationList: Array<Citation>
  nameRules: Array<Function>
}

export default Vue.extend({
  name: 'PlaylistSeriesMetaSameAs',
  props: {
    playlist: {
      type: Object,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      citationList: [],
      nameRules: [
        (v: String) => !!v || 'Name is required',
        (v: String) =>
          (v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
    }
  },
  methods: {
    addCitation() {
      this.citationList.push({
        name: '',
        url: '',
      })
    },
    removeCitation(citation: Citation) {
      this.citationList.splice(this.citationList.indexOf(citation), 1)
    },
  },
})
</script>
