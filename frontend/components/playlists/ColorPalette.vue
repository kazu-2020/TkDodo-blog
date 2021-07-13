<template>
  <div>
    <v-row>
      <v-col>
        <v-btn-toggle
          value="selectedPalette"
          class="palettes"
          group
          mandatory
          tile
        >
          <v-btn
            v-for="(color, index) in paletteBaseColors"
            :key="`paletteBaseColors-${index}`"
            :value="`${color}`"
            :class="[index !== 0 && 'ml-3', 'palette']"
            :style="{ backgroundColor: `${color} !important` }"
            elevation="4"
            @click="selectPalette($event)"
          />
          <!-- pickerで色が自由に選択できるpalette -->
          <v-menu :close-on-content-click="false" offset-x>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                :value="`${freePaletteColor}`"
                class="ml-3 custom_color"
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
        v-for="(color, name) in adjustedColors"
        :key="`adjustedColors-${name}`"
        class="shrink color-field"
      >
        <v-text-field
          v-model="adjustedColors[name]"
          :label="name"
          class="ma-0 pa-0"
          :color="color"
          hide-details
          outlined
          readonly
        >
          <template #append>
            <v-sheet width="30" height="30" elevation="4" :color="color" />
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  adjustPrimaryDarkColor,
  adjustPrimaryLightColor,
  adjustLinkDarkColor,
  adjustLinkLightColor,
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
    selectedPalette: {
      type: String,
      required: false,
      default: '#FFFFFF',
    },
  },
  data() {
    return {
      freePaletteColor: (this as any).isSelectedColorByPalette(
        this.selectedPalette
      )
        ? '#FFFFFF'
        : this.selectedPalette,
    }
  },
  computed: {
    paletteBaseColors: () => PALETTE_BASE_COLORS,
    currentPalette(): string {
      return this.selectedPalette || '#FFFFFF'
    },
    adjustedColors(): Object {
      return {
        primaryLight: adjustPrimaryLightColor(this.currentPalette),
        primaryDark: adjustPrimaryDarkColor(this.currentPalette),
        linkLight: adjustLinkLightColor(this.currentPalette),
        linkDark: adjustLinkDarkColor(this.currentPalette),
      }
    },
  },
  methods: {
    selectPalette(event: Event): void {
      if (event.target == null) return
      const element = event.target as HTMLInputElement
      this.emitAdjustedColors(element.value)
    },
    onUpdatePicker(colorObject: any) {
      this.emitAdjustedColors(colorObject?.hex)
    },
    emitAdjustedColors(colorHex: string) {
      this.$emit('update:selectedPalette', colorHex)
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
</style>
