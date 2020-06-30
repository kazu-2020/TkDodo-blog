<template>
  <v-card flat>
    <v-row dense class="my-5">
      <v-container fluid>
        <v-row dense>
          <v-col cols="2">
            <v-card>
              <v-card-title>
                ロゴ
              </v-card-title>
              <v-img :src="logoImageUrl" height="100" />
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card>
              <v-card-title>
                アイキャッチ
              </v-card-title>
              <v-img :src="eyecatchImageUrl" height="100" />
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card>
              <v-card-title>
                ヒーローイメージ
              </v-card-title>
              <v-img :src="heroImageUrl" height="100" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-row dense class="my-5 colors">
        <v-col cols="12" class="px-4">
          <h3>色 - Color</h3>
          <p class="note">
            ここで選んだ色がアクセシビリティに配慮された色に変換されページに反映されます
          </p>
        </v-col>
        <v-col cols="12">
          <v-row>
            <v-col cols="12" class="d-flex flex-row px-6">
              <v-sheet
                v-for="sheetColor in sheetColors"
                :key="`sheet-${sheetColor}`"
                width="30"
                height="30"
                elevation="4"
                :color="sheetColor"
                class="mr-4"
                @click="selectColor(sheetColor)"
              />
            </v-col>
          </v-row>
          <v-row justify="start" align="center" class="px-4">
            <v-col class="shrink" style="min-width: 220px;">
              <v-text-field
                v-model="color"
                v-mask="mask"
                hide-details
                class="ma-0 pa-0"
                solo
              >
                <template v-slot:append>
                  <v-menu
                    v-model="menu"
                    top
                    nudge-bottom="105"
                    nudge-left="16"
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ on }">
                      <div :style="swatchStyle" v-on="on" />
                    </template>
                    <v-card>
                      <v-card-text class="pa-0">
                        <v-color-picker v-model="color" flat />
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
  sheetColors: Array<String>
  color: string
  mask: string
  menu: boolean
}

export default Vue.extend({
  name: 'PlaylistSeriesMetaVisual',
  components: {},
  props: {
    playlist: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({
    sheetColors: [
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
      '#FFFFFF',
    ],
    color: '#FFFFFF',
    mask: '!#XXXXXXXX',
    menu: false,
  }),
  computed: {
    swatchStyle() {
      const { color, menu } = this
      return {
        backgroundColor: color,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        borderRadius: menu ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out',
      }
    },
    logoImageUrl() {
      return (
        this.playlist.logo?.medium?.url || 'https://placehold.jp/640x640.png'
      )
    },
    eyecatchImageUrl() {
      return (
        this.playlist.eyecatch?.medium?.url ||
        'https://placehold.jp/640x640.png'
      )
    },
    heroImageUrl() {
      return (
        this.playlist.hero?.medium?.url || 'https://placehold.jp/640x640.png'
      )
    },
  },
  methods: {
    selectColor(color: string) {
      this.color = color
    },
  },
})
</script>
