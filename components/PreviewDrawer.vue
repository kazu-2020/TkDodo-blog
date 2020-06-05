<template>
  <v-navigation-drawer v-model="drawer" absolute temporary right width="600">
    <v-list-item>
      <v-list-item-title>Preview</v-list-item-title>
    </v-list-item>
    <v-divider />
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'

export type DataType = {
  drawer: boolean
}

export default Vue.extend({
  props: {
    isShowDrawer: {
      type: Boolean,
      default: false,
    },
  },
  data(): DataType {
    return {
      drawer: this.isShowDrawer,
    }
  },
  watch: {
    isShowDrawer: {
      handler(newVal) {
        this.drawer = newVal
      },
      immediate: true,
    },
    drawer: {
      handler(newVal) {
        this.$emit('current-drawer-state', newVal)
      },
    },
  },
})
</script>
