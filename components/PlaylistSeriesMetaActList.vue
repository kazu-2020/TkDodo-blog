<template>
  <v-row justify="center">
    <v-col
      v-for="(act, index) in actList"
      :key="index"
      v-col
      cols="3"
      align="center"
    >
      {{ act }}
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PlaylistSeriesMetaActList',
  components: {},
  props: {
    actList: {
      type: Array,
      default: () => [],
    },
  },
})
</script>
