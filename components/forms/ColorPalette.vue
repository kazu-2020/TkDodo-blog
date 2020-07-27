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
          <v-btn-toggle class="palettes" group mandatory tile>
            <v-btn
              v-for="(color, index) in colors"
              :key="color"
              :value="`#${color}`"
              :class="[index !== 0 ? 'ml-3' : null, 'palette']"
              :style="{ backgroundColor: `#${color} !important` }"
              elevation="4"
              @click="selectPalette($event)"
            />
            <v-menu :close-on-content-click="false" offset-x>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  :value="`${selectedPaletteColor}`"
                  class="ml-3"
                  :style="{
                    backgroundColor: `${selectedPaletteColor} !important`,
                  }"
                  elevation="4"
                  v-on="on"
                />
              </template>
              <v-color-picker
                v-model="selectedPaletteColor"
                mode="hexa"
                elevation="15"
                hide-mode-switch
                @update:color="selectedPicker"
              />
            </v-menu>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-row justify="start" align="center" class="color-fields">
        <v-col
          v-for="(value, key, index) in palette"
          :key="index"
          class="shrink color-field"
        >
          <v-text-field
            v-model="palette[key]"
            label="Primary light color"
            class="ma-0 pa-0"
            :color="value"
            hide-details
            outlined
            readonly
          >
            <template v-slot:append>
              <v-sheet width="30" height="30" elevation="4" :color="value" />
            </template>
          </v-text-field>
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
    selectedPaletteColor: '#FFFFFF',
    palette: {
      primaryLight: '#FFFFFF',
      primaryDark: '#FFFFFF',
      linkLight: '#FFFFFF',
      linkDark: '#FFFFFF',
    },
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
      this.setAdjustedColors(colorHex)
    },
    selectedPicker(selectedColor) {
      this.setAdjustedColors(selectedColor.hex)
    },
    setAdjustedColors(colorHex) {
      this.palette.primaryLight = adjustPrimaryLightColor(colorHex)
      this.palette.linkLight = adjustLinkLightColor(colorHex)
      this.palette.primaryDark = adjustPrimaryDarkColor(colorHex)
      this.palette.linkDark = adjustLinkDarkColor(colorHex)
    },
  },
})
</script>

<style lang="scss">
.palettes {
  .palette {
    opacity: 1 !important;
  }
  .v-item--active {
    border: solid 2px #eeeeee !important;
  }
}
.color-fields {
  .v-input__append-inner {
    margin-top: 14px;
  }
  .color-field {
    min-width: 180px;
  }
}

.v-color-picker__input > input {
  /* FIXME: vuetifyのv-color-pickerのinputの文字色がdark mode時も黒なのでどちらでも可視できる色を設定 */
  color: gray;
}
</style>
