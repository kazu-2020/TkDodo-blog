<template>
  <v-row dense class="my-5">
    <v-col cols="12">
      <h3>色 - Color</h3>
      <p>
        ここで選んだ色がアクセシビリティに配慮された色に変換されページに反映されます
      </p>
    </v-col>
    <v-col cols="12" class="colors">
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
        <v-col class="shrink color-field">
          <v-text-field
            v-model="pallets.primaryLight"
            label="Primary light color"
            class="ma-0 pa-0"
            :color="pallets.primaryLight"
            hide-details
            outlined
            readonly
          >
            <template v-slot:append>
              <v-sheet
                width="30"
                height="30"
                elevation="4"
                :color="pallets.primaryLight"
              />
            </template>
          </v-text-field>
        </v-col>
        <v-col class="shrink color-field">
          <v-text-field
            v-model="pallets.primaryDark"
            label="Primary dark color"
            class="ma-0 pa-0"
            :color="pallets.primaryDark"
            hide-details
            outlined
            readonly
          >
            <template v-slot:append class="mt-3">
              <v-sheet
                width="30"
                height="30"
                elevation="4"
                :color="pallets.primaryDark"
              />
            </template>
          </v-text-field>
        </v-col>
        <v-col class="shrink color-field">
          <v-text-field
            v-model="pallets.linkLight"
            label="Link light color"
            class="ma-0 pa-0"
            :color="pallets.linkLight"
            hide-details
            outlined
            readonly
          >
            <template v-slot:append class="mt-3">
              <v-sheet
                width="30"
                height="30"
                elevation="4"
                :color="pallets.linkLight"
              />
            </template>
          </v-text-field>
        </v-col>
        <v-col class="shrink color-field">
          <v-text-field
            v-model="pallets.linkDark"
            label="Link dark color"
            class="ma-0 pa-0"
            :color="pallets.linkDark"
            hide-details
            outlined
            readonly
            dark
          >
            <template v-slot:append class="mt-3">
              <v-sheet
                width="30"
                height="30"
                elevation="4"
                :color="pallets.linkDark"
              />
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
.colors {
  .v-input__append-inner {
    margin-top: 14px;
  }
  .color-field {
    min-width: 180px;
  }
}
</style>
