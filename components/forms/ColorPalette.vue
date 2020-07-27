<template>
  <div>
    <v-row>
      <v-col>
        <v-btn-toggle class="palettes" group mandatory tile>
          <v-btn
            v-for="(color, index) in paletteBaseColors"
            :key="color"
            :value="`#${color}`"
            :class="[index !== 0 ? 'ml-3' : null, 'palette']"
            :style="{ backgroundColor: `#${color} !important` }"
            elevation="4"
            @click="selectPalette($event)"
          />
          <!-- pickerで色が自由に選択できるpalette -->
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
              @update:color="onUpdatePicker"
            />
          </v-menu>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row justify="start" align="center" class="color-fields">
      <v-col
        v-for="(value, key, index) in adjustedColor"
        :key="index"
        class="shrink color-field"
      >
        <v-text-field
          v-model="adjustedColor[key]"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { VColorPickerColor } from 'vuetify/src/components/VColorPicker/util'
import {
  adjustPrimaryLightColor,
  adjustLinkDarkColor,
  adjustLinkLightColor,
  adjustPrimaryDarkColor,
} from '@/utils/adjustColor'

const PALETTE_BASE_COLORS: Array<String> = [
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
]

export default Vue.extend({
  data: () => ({
    selectedPaletteColor: '#FFFFFF',
    adjustedColor: {
      primaryLight: '#FFFFFF',
      primaryDark: '#FFFFFF',
      linkLight: '#FFFFFF',
      linkDark: '#FFFFFF',
    },
  }),
  computed: {
    paletteBaseColors: () => PALETTE_BASE_COLORS,
  },
  methods: {
    selectPalette(event: Event) {
      if (event.target == null) return
      const element = event.target as HTMLInputElement
      this.setAdjustedColor(element.value)
    },
    onUpdatePicker(colorObject: VColorPickerColor) {
      this.setAdjustedColor(colorObject.hex)
    },
    setAdjustedColor(colorHex: string) {
      this.adjustedColor.primaryLight = adjustPrimaryLightColor(colorHex)
      this.adjustedColor.linkLight = adjustLinkLightColor(colorHex)
      this.adjustedColor.primaryDark = adjustPrimaryDarkColor(colorHex)
      this.adjustedColor.linkDark = adjustLinkDarkColor(colorHex)
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
