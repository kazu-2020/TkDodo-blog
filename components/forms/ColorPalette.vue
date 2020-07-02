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
          <v-btn-toggle class="btn-group-palettes" group mandatory tile>
            <v-btn
              v-for="(color, index) in colors"
              :key="color"
              :value="`#${color}`"
              :class="[index !== 0 ? 'ml-3' : null, 'btn-palette']"
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
            :color="pallets.linkDark"
            hide-details
            outlined
            readonly
            dark
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import Vue from 'vue'
import {
  adjustPrimaryLightColor,
  adjustLinkDarkColor,
  adjustLinkLightColor,
  adjustPrimaryDarkColor,
} from '@/utils/adjustColor'

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

      this.pallets.primaryLight = adjustPrimaryLightColor(colorHex)
      this.pallets.linkLight = adjustLinkLightColor(colorHex)
      this.pallets.primaryDark = adjustPrimaryDarkColor(colorHex)
      this.pallets.linkDark = adjustLinkDarkColor(colorHex)
    },
  },
})
</script>

<style lang="scss">
.btn-palette {
  opacity: 1 !important;
}
</style>
