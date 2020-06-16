<template>
  <v-row dense class="ma-4">
    <v-col cols="12">
      <v-row
        v-for="sameAs in sameAsList"
        :key="sameAs.id"
        justify="center"
        align="center"
      >
        <v-col cols="5">
          <v-text-field v-model="sameAs.name" :rules="nameRules" label="名前" />
        </v-col>
        <v-col cols="5">
          <v-text-field v-model="sameAs.url" :rules="nameRules" label="URL" />
        </v-col>
        <v-col cols="2">
          <v-btn color="error" class="mr-4" @click="removeSameAs(sameAs)">
            削除
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" class="ma-2">
      <v-btn @click="addSameAs">
        <v-icon>mdi-plus</v-icon>
        リンク(同一内容)を追加
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

interface SameAs {
  name: string
  url: string
}

interface DataType {
  sameAsList: Array<SameAs>
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
      sameAsList: [],
      nameRules: [
        (v: String) => !!v || 'Name is required',
        (v: String) =>
          (v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
    }
  },
  methods: {
    addSameAs() {
      this.sameAsList.push({
        name: '',
        url: '',
      })
    },
    removeSameAs(sameAs: SameAs) {
      this.sameAsList.splice(this.sameAsList.indexOf(sameAs), 1)
    },
  },
})
</script>
