<template>
  <v-row dense class="my-5">
    <v-col cols="12">
      <h3>色 - Color</h3>
      <p>
        ここで選んだ色がアクセシビリティに配慮された色に変換されページに反映されます
      </p>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col>
          <v-btn-toggle group mandatory tile>
            <v-btn
              v-for="(color, index) in colors"
              :key="color"
              :value="`#${color}`"
              :class="{ 'ml-3': index !== 0 }"
              :style="{ backgroundColor: `#${color} !important` }"
              elevation="4"
              @click="selectPalette($event)"
            />
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-row justify="start" align="center">
        <v-col class="shrink" style="min-width: 160px;">
          <v-text-field
            v-model="pallets.primaryLight"
            label="Primary light color"
            class="ma-0 pa-0"
            hide-details
            outlined
            readonly
          />
        </v-col>
        <v-col class="shrink" style="min-width: 160px;">
          <v-text-field
            v-model="pallets.primaryDark"
            label="Primary dark color"
            class="ma-0 pa-0"
            hide-details
            outlined
            readonly
          />
        </v-col>
        <v-col class="shrink" style="min-width: 160px;">
          <v-text-field
            v-model="pallets.linkLight"
            label="Link light color"
            class="ma-0 pa-0"
            hide-details
            outlined
            readonly
          />
        </v-col>
        <v-col class="shrink" style="min-width: 160px;">
          <v-text-field
            v-model="pallets.linkDark"
            label="Link dark color"
            class="ma-0 pa-0"
            hide-details
            outlined
            readonly
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import Vue from 'vue'
import { adjustColor } from '@/utils/adjustColor'

export default Vue.extend({
  data: () => ({
    color: '#FFFFFF',
    pallets: {
      primaryLight: '#FFFFFF',
      primaryDark: '#FFFFFF',
      linkLight: '#FFFFFF',
      linkDark: '#FFFFFF',
    },
    menu: false,
    colors: [
      'faf100',
      'f6aa00',
      'ff2800',
      '990099',
      '005aff',
      '03af7a',
      'ff8082',
      '4dc4ff',
      '804000',
      '84919e',
    ],
  }),
  methods: {
    selectPalette(event) {
      const colorHex = event.target.value

      this.pallets.primaryLight = adjustColor(colorHex, '#FAFAFA', 3)
      this.pallets.linkLight = adjustColor(colorHex, '#FAFAFA', 4.5)
      this.pallets.primaryDark = adjustColor(colorHex, '#1f1f20', 3)
      this.pallets.linkDark = adjustColor(colorHex, '#1f1f20', 4.5)
    },
  },
})
</script>

<style scoped>
.v-btn-toggle .v-btn {
  opacity: 1;
}
</style>
