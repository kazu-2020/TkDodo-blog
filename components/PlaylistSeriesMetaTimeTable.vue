<template>
  <div class="my-5">
    <v-row
      v-for="timeTable in detailedTimeTables"
      :key="timeTable.id"
      justify="center"
      align="center"
      class="mx-4"
    >
      <v-col cols="3">
        <v-select v-model="timeTable.serviceId" :items="services" required />
      </v-col>
      <v-col cols="5">
        <v-text-field
          v-model="timeTable.description"
          :rules="nameRules"
          label="説明 - Description"
        />
      </v-col>
      <v-col cols="2">
        <v-checkbox v-model="timeTable.isRerun" label="再放送" />
      </v-col>
      <v-col cols="2">
        <v-btn
          color="error"
          class="mr-4"
          @click="removeDetailedTimeTable(timeTable)"
        >
          削除
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mx-4">
      <v-col cols="12">
        <v-btn class="mr-4" @click="addDetailedTimeTable">
          <v-icon>mdi-plus</v-icon>
          タイムテーブルを追加
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface DetailedTimeTable {
  serviceId: string
  description: string
  isRerun: boolean
}

interface DataType {
  detailedTimeTables: Array<DetailedTimeTable>
  nameRules: Array<Function>
  services: Array<object>
}

export default Vue.extend({
  name: 'PlaylistSeriesMetaTimeTable',
  props: {
    playlist: {
      type: Object,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      detailedTimeTables: [],
      nameRules: [
        (v: String) => !!v || 'Name is required',
        (v: String) =>
          (v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
      services: [
        { value: 'g1', text: '総合1' },
        { value: 'g2', text: '総合2' },
        { value: 'e1', text: 'Eテレ1' },
        { value: 'e2', text: 'Eテレ2' },
        { value: 'e3', text: 'Eテレ3' },
        { value: 's1', text: 'BS1' },
        { value: 's2', text: 'BS1' },
        { value: 's3', text: 'BSプレミアム' },
        { value: 's4', text: 'BSプレミアム' },
        { value: 's5', text: 'BS4K' },
        { value: 's6', text: 'BS8K' },
      ],
    }
  },
  methods: {
    addDetailedTimeTable() {
      this.detailedTimeTables.push({
        serviceId: 'g1',
        description: '',
        isRerun: false,
      })
    },
    removeDetailedTimeTable(timeTable: DetailedTimeTable) {
      this.detailedTimeTables.splice(
        this.detailedTimeTables.indexOf(timeTable),
        1
      )
    },
  },
})
</script>
