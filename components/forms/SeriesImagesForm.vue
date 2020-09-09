<template>
  <v-row>
    <v-col cols="auto">
      <label class="text--secondary">ロゴ - Logo</label>
      <v-hover v-slot:default="{ hover }">
        <v-card tile width="140" height="140">
          <v-img :src="logoImageUrl">
            <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex flex-column black v-card--reveal white--text"
                style="height: 140px"
              >
                <v-btn @click="openDialog('logo')">
                  <span>編集</span>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn class="red--text mt-3" @click="removeLogoImage">
                  <span>削除</span>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-expand-transition>
          </v-img>
          <input
            id="logoImageFile"
            ref="logoImageInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="replaceLogoImage"
          />
        </v-card>
      </v-hover>
    </v-col>
    <v-col cols="auto">
      <label class="text--secondary">アイキャッチ - Eyecatch</label>
      <v-hover v-slot:default="{ hover }">
        <v-card tile width="249" height="140">
          <v-img :src="eyecatchImageUrl">
            <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex flex-column black v-card--reveal white--text"
                style="height: 140px"
              >
                <v-btn @click="openDialog('eyecatch')">
                  <span>編集</span>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn class="red--text mt-3" @click="removeEyecatchImage">
                  <span>削除</span>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-expand-transition>
          </v-img>
          <input
            id="eyecatchImageFile"
            ref="eyecatchImageInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="replaceEyecatchImage"
          />
        </v-card>
      </v-hover>
    </v-col>
    <v-col cols="auto">
      <label class="text--secondary">ヒーロー - Hero</label>
      <v-hover v-slot:default="{ hover }">
        <v-card tile width="420" height="140">
          <v-img :src="heroImageUrl">
            <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex flex-column black v-card--reveal white--text"
                style="height: 140px"
              >
                <v-btn @click="openDialog('hero')">
                  <span>編集</span>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn class="red--text mt-3" @click="removeHeroImage">
                  <span>削除</span>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-expand-transition>
          </v-img>
          <input
            id="heroImageFile"
            ref="heroImageInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="replaceHeroImage"
          />
        </v-card>
      </v-hover>
    </v-col>
    <v-col>
      <TrimmingImageDialog
        :is-show-dialog="isShowTrimmingImageDialog"
        :aspect-ratio-denominator="aspectRatioDenominator"
        :aspect-ratio-numerator="aspectRatioNumerator"
        @hide-trimming-image-dialog="closeDialog"
        @trimmed-image="trimmedImage($event)"
        @trimmingImgSrc="trimmingImgSrc = $event"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import TrimmingImageDialog from '~/components/forms/TrimmingImageDialog.vue'

interface DataType {
  logoImageData: string
  eyecatchImageData: string
  heroImageData: string
  isRemoveLogoImage: boolean
  isRemoveEyecatchImage: boolean
  isRemoveHeroImage: boolean
  isShowTrimmingImageDialog: boolean
  trimmingImageType: string
  aspectRatioDenominator: number
  aspectRatioNumerator: number
}

const defaultLogoImageUrl = 'https://placehold.jp/140x140.png?text=1x1'
const defaultEyecatchImageUrl = 'https://placehold.jp/249x140.png?text=16x9'
const defaultHeroImageUrl = 'https://placehold.jp/420x140.png?text=3x1'

export default Vue.extend({
  name: 'SeriesImagesForm',
  components: { TrimmingImageDialog },
  props: {
    playlist: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data(): DataType {
    return {
      logoImageData: '',
      eyecatchImageData: '',
      heroImageData: '',
      isRemoveLogoImage: false,
      isRemoveEyecatchImage: false,
      isRemoveHeroImage: false,
      isShowTrimmingImageDialog: false,
      trimmingImageType: '',
      aspectRatioDenominator: 0,
      aspectRatioNumerator: 0,
    }
  },
  computed: {
    logoImageUrl(): string {
      if (this.isRemoveLogoImage) {
        return defaultLogoImageUrl
      }

      return (
        this.logoImageData ||
        this.playlist.logo?.medium?.url ||
        defaultLogoImageUrl
      )
    },
    eyecatchImageUrl(): string {
      if (this.isRemoveEyecatchImage) {
        return defaultEyecatchImageUrl
      }

      return (
        this.eyecatchImageData ||
        this.playlist.eyecatch?.medium?.url ||
        defaultEyecatchImageUrl
      )
    },
    heroImageUrl(): string {
      if (this.isRemoveHeroImage) {
        return defaultHeroImageUrl
      }

      return (
        this.heroImageData ||
        this.playlist.hero?.medium?.url ||
        defaultHeroImageUrl
      )
    },
  },
  methods: {
    openDialog(type: string) {
      this.trimmingImageType = type

      if (this.trimmingImageType === 'logo') {
        this.aspectRatioDenominator = 1
        this.aspectRatioNumerator = 1
      } else if (this.trimmingImageType === 'eyecatch') {
        this.aspectRatioDenominator = 16
        this.aspectRatioNumerator = 9
      } else if (this.trimmingImageType === 'hero') {
        this.aspectRatioDenominator = 3
        this.aspectRatioNumerator = 1
      }

      this.isShowTrimmingImageDialog = true
    },
    closeDialog() {
      this.trimmingImageType = ''
      this.isShowTrimmingImageDialog = false
    },
    replaceLogoImage() {
      const inputElement = this.$refs.logoImageInput as HTMLInputElement
      this.replaceImage(inputElement, 'logo')
      this.isRemoveLogoImage = false
    },
    removeLogoImage() {
      this.isRemoveLogoImage = true
      this.$emit('remove-series-image', 'logo')
    },
    replaceEyecatchImage() {
      const inputElement = this.$refs.eyecatchImageInput as HTMLInputElement
      this.replaceImage(inputElement, 'eyecatch')
      this.isRemoveEyecatchImage = false
    },
    removeEyecatchImage() {
      this.isRemoveEyecatchImage = true
      this.$emit('remove-series-image', 'eyecatch')
    },
    replaceHeroImage() {
      const inputElement = this.$refs.heroImageInput as HTMLInputElement
      this.replaceImage(inputElement, 'hero')
      this.isRemoveHeroImage = false
    },
    removeHeroImage() {
      this.isRemoveHeroImage = true
      this.$emit('remove-series-image', 'hero')
    },
    trimmedImage(value: string) {
      if (this.trimmingImageType === 'logo') {
        this.logoImageData = value
        this.$emit('update-series-image', { type: 'logo', file: value }) // TODO: リネーム
      } else if (this.trimmingImageType === 'eyecatch') {
        this.eyecatchImageData = value
        this.replaceEyecatchImage()
        this.$emit('update-series-image', { type: 'eyecatch', file: value }) // TODO: リネーム
      } else if (this.trimmingImageType === 'hero') {
        this.heroImageData = value
        this.replaceHeroImage()
        this.$emit('update-series-image', { type: 'hero', file: value }) // TODO: リネーム
      }
    },
    replaceImage(targetElement: HTMLInputElement, type: string) {
      console.log(targetElement)
      console.log(targetElement.src)
      console.log(targetElement.files)
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

<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.9;
  position: absolute;
  width: 100%;
}
</style>
