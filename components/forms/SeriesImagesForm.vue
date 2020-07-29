<template>
  <v-row>
    <v-col cols="2">
      <v-card tile>
        <v-card-title>
          ロゴ
        </v-card-title>
        <v-img
          :src="logoImageUrl"
          aspect-ratio="1"
          @click="selectLogoImageFile"
        />
        <input
          id="logoImageFile"
          ref="logoImageInput"
          type="file"
          accept="image/*"
          style="display: none;"
          @change="replaceLogoImage"
        />
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card tile>
        <v-card-title>
          アイキャッチ
        </v-card-title>
        <v-img
          :src="eyecatchImageUrl"
          aspect-ratio="1.777777778"
          @click="selectEyecatchImageFile"
        />
        <input
          id="eyecatchImageFile"
          ref="eyecatchImageInput"
          type="file"
          accept="image/*"
          style="display: none;"
          @change="replaceEyecatchImage"
        />
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card tile>
        <v-card-title>
          ヒーローイメージ
        </v-card-title>
        <v-img
          :src="heroImageUrl"
          aspect-ratio="3"
          @click="selectHeroImageFile"
        />
        <input
          id="heroImageFile"
          ref="heroImageInput"
          type="file"
          accept="image/*"
          style="display: none;"
          @change="replaceHeroImage"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
  logoImageData: string | null
  eyecatchImageData: string | null
  heroImageData: string | null
}

export default Vue.extend({
  name: 'SeriesImagesForm',
  props: {
    playlist: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      logoImageData: null,
      eyecatchImageData: null,
      heroImageData: null,
    }
  },
  computed: {
    logoImageUrl(): string {
      return (
        this.logoImageData ||
        this.playlist.logo?.medium?.url ||
        'https://placehold.jp/640x640.png'
      )
    },
    eyecatchImageUrl(): string {
      return (
        this.eyecatchImageData ||
        this.playlist.eyecatch?.medium?.url ||
        'https://placehold.jp/640x360.png'
      )
    },
    heroImageUrl(): string {
      return (
        this.heroImageData ||
        this.playlist.hero?.medium?.url ||
        'https://placehold.jp/1080x360.png'
      )
    },
  },
  methods: {
    selectLogoImageFile() {
      ;(this.$refs.logoImageInput as HTMLElement).click()
    },
    replaceLogoImage() {
      const inputElement = this.$refs.logoImageInput as HTMLInputElement
      this.replaceImage(inputElement, 'logo')
    },
    selectEyecatchImageFile() {
      ;(this.$refs.eyecatchImageInput as HTMLElement).click()
    },
    replaceEyecatchImage() {
      const inputElement = this.$refs.eyecatchImageInput as HTMLInputElement
      this.replaceImage(inputElement, 'eyecatch')
    },
    selectHeroImageFile() {
      ;(this.$refs.heroImageInput as HTMLElement).click()
    },
    replaceHeroImage() {
      const inputElement = this.$refs.heroImageInput as HTMLInputElement
      this.replaceImage(inputElement, 'hero')
    },
    replaceImage(targetElement: HTMLInputElement, type: string) {
      if (targetElement.files === null) {
        return
      }
      const file = targetElement.files[0]

      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target !== null) {
            switch (type) {
              case 'logo':
                this.logoImageData = e.target.result as string
                this.$emit('update-series-image', { type, file })
                break
              case 'eyecatch':
                this.eyecatchImageData = e.target.result as string
                this.$emit('update-series-image', { type, file })
                break
              case 'hero':
                this.heroImageData = e.target.result as string
                this.$emit('update-series-image', { type, file })
                break
            }
          }
        }
        reader.readAsDataURL(file)
      }
    },
  },
})
</script>
