<template>
  <div>
    <v-row>
      <v-col>
        <v-btn-toggle
          v-model="localSelectedPaletteColor"
          class="palettes"
          group
          mandatory
          tile
        >
          <v-btn
            v-for="(color, index) in paletteBaseColors"
            :key="index"
            :value="`${color}`"
            :class="[index !== 0 && 'ml-3', 'palette']"
            :style="{ backgroundColor: `${color} !important` }"
            elevation="4"
            @click="selectPalette($event)"
          />
          <!-- pickerで色が自由に選択できるpalette -->
          <v-menu :close-on-content-click="false" offset-x>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                :value="`${freePaletteColor}`"
                class="ml-3"
                :style="{
                  backgroundColor: `${freePaletteColor} !important`,
                }"
                elevation="4"
                v-on="on"
              />
            </template>
            <v-color-picker
              v-model="freePaletteColor"
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
        v-for="(color, name, index) in adjustedColors"
        :key="index"
        class="shrink color-field"
      >
        <v-text-field
          v-model="adjustedColors[name]"
          label="Primary light color"
          class="ma-0 pa-0"
          :color="color"
          hide-details
          outlined
          readonly
        >
          <template v-slot:append>
            <v-sheet width="30" height="30" elevation="4" :color="color" />
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
  '#faf100',
  '#f6aa00',
  '#ff2800',
  '#990099',
  '#005aff',
  '#03af7a',
  '#ff8082',
  '#4dc4ff',
  '#804000',
  '#84919e',
]

export default Vue.extend({
  props: {
    selectedPaletteColor: {
      type: String,
      required: false,
      default: '#FFFFFF',
    },
  },
  data() {
    return {
      // NOTE: 「localXXXX」について
      //  state.editingPlaylistの更新後にpropsが渡ってこないためstoreとは別にコンポーネント内で管理している
      // FIXME: state.editingPlaylistの更新の検出が上手くできるようになったら不要になるので修正する
      localSelectedPaletteColor: this.selectedPaletteColor,
      localPrimaryLightColor: adjustPrimaryLightColor(
        this.selectedPaletteColor
      ),
      localPrimaryDarkColor: adjustPrimaryDarkColor(this.selectedPaletteColor),
      localLinkLightColor: adjustLinkLightColor(this.selectedPaletteColor),
      localLinkDarkColor: adjustLinkDarkColor(this.selectedPaletteColor),
      freePaletteColor: (this as any).isSelectedColorByPalette(
        this.selectedPaletteColor
      )
        ? '#FFFFFF'
        : this.selectedPaletteColor,
    }
  },
  computed: {
    paletteBaseColors: () => PALETTE_BASE_COLORS,
    adjustedColors(): Object {
      return {
        primaryLight: this.localSelectedPaletteColor,
        primaryDark: this.localPrimaryLightColor,
        linkLight: this.localPrimaryDarkColor,
        linkDark: this.localLinkLightColor,
      }
    },
  },
  methods: {
    selectPalette(event: Event): void {
      if (event.target == null) return
      const element = event.target as HTMLInputElement
      this.emitAdjustedColors(element.value)
    },
    onUpdatePicker(colorObject: VColorPickerColor) {
      this.emitAdjustedColors(colorObject.hex)
    },
    emitAdjustedColors(colorHex: string) {
      this.localSelectedPaletteColor = colorHex
      this.localPrimaryLightColor = adjustPrimaryLightColor(colorHex)
      this.localPrimaryDarkColor = adjustPrimaryDarkColor(colorHex)
      this.localLinkLightColor = adjustLinkLightColor(colorHex)
      this.localLinkDarkColor = adjustLinkDarkColor(colorHex)

      this.$emit('update:selectedPaletteColor', this.localSelectedPaletteColor)
    },
    isSelectedColorByPalette(color: string): boolean {
      return PALETTE_BASE_COLORS.includes(color)
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
