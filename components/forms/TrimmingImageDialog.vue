<template>
  <v-dialog v-model="isShowDialog" class="mx-auto" persistent max-width="900px">
    <v-card>
      <v-container class="pb-0">
        <v-row align="center" no-gutters>
          <v-col cols="11">
            <v-card-title>
              <span class="headline">画像を編集</span>
            </v-card-title>
          </v-col>
          <v-col cols="1">
            <v-btn
              color="white darken-1"
              class="float-right"
              text
              @click="hideTrimmingImageDialog"
            >
              <v-icon large>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-stepper v-model="step" alt-labels>
        <v-stepper-header :elevation="0">
          <v-stepper-step :complete="step > 1" step="1"
            >画像アップロード</v-stepper-step
          >
          <v-divider />
          <v-stepper-step :complete="step > 2" step="2"
            >範囲選択</v-stepper-step
          >
          <v-divider />
          <v-stepper-step step="3">確認</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row justify="center" align-content="center">
              <v-col v-if="!image.src" cols="12">
                <image-input v-model="image" />
              </v-col>
              <v-col v-if="image.src" cols="auto">
                <img
                  alt=""
                  :src="image.src"
                  style="height: 400px; object-fit: contain"
                />
              </v-col>
            </v-row>
            <v-row v-if="image.src" justify="center">
              <v-btn @click="clearImage">画像を変更する</v-btn>
              <v-btn color="primary" @click="step = 2">次へ</v-btn>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-row justify="center" align-content="center">
              <v-col v-if="step === 2 && image.src" cols="auto">
                <vue-cropper
                  ref="cropper"
                  drag-mode="crop"
                  class="img-area"
                  :aspect-ratio="aspectRatio"
                  :src="image.src"
                  :view-mode="3"
                  :zoomable="false"
                  :movable="false"
                  :guides="false"
                  :min-crop-box-height="20"
                  :min-crop-box-width="20"
                  :auto-crop-area="1"
                  :max-container-height="adjustedHeight"
                  :max-container-width="adjustedWidth"
                  :img-style="{
                    width: adjustedWidth + 'px',
                    height: adjustedHeight + 'px',
                  }"
                  :container-style="{
                    width: adjustedWidth + 'px',
                    height: adjustedHeight + 'px',
                  }"
                />
              </v-col>
            </v-row>

            <v-row justify="center">
              <v-btn @click="step = 1">戻る</v-btn>
              <v-btn color="primary" @click="setCropperImage">次へ</v-btn>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-row justify="center" align-content="center">
              <v-col v-if="trimmingImgSrc" cols="auto">
                <img
                  alt=""
                  :src="trimmingImgSrc"
                  style="max-height: 400px; width: 852px; object-fit: contain"
                />
              </v-col>
            </v-row>

            <v-row justify="center">
              <v-btn @click="step = 2">戻る</v-btn>
              <v-btn color="primary" @click="complete">決定</v-btn>
            </v-row>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

import CropperUtil from '@/utils/cropperUtil'
import ImageInput from './ImageInput.vue'

interface DataType {
  image: HTMLImageElement
  trimmingImgSrc: string
  step: number
}

export default Vue.extend({
  components: {
    VueCropper,
    ImageInput,
  },
  props: {
    isShowDialog: {
      type: Boolean,
      required: false,
    },
    aspectRatioDenominator: {
      type: Number,
      required: false,
      default: 1,
    },
    aspectRatioNumerator: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  data(): DataType {
    return {
      image: {} as HTMLImageElement,
      trimmingImgSrc: '',
      step: 1,
    }
  },
  computed: {
    aspectRatio(): number {
      return this.aspectRatioDenominator / this.aspectRatioNumerator
    },
    adjustedHeight(): number {
      const adjustedSize: number[] = this.adjustedSize()
      return adjustedSize[0]
    },
    adjustedWidth(): number {
      const adjustedSize: number[] = this.adjustedSize()
      return adjustedSize[1]
    },
  },
  methods: {
    hideTrimmingImageDialog(): void {
      this.step = 1
      this.image = {} as HTMLImageElement
      this.$emit('hide-trimming-image-dialog')
    },
    adjustedSize(): number[] {
      return CropperUtil.getAdjustedSize(this.image.height, this.image.width)
    },
    setCropperImage(): void {
      this.step = 3
      const cropper = this.$refs.cropper as any
      this.trimmingImgSrc = cropper
        .getCroppedCanvas()
        .toDataURL(this.getMimeTypeFromBase64())
    },
    clearImage(): void {
      this.image = {} as HTMLImageElement
    },
    getMimeTypeFromBase64(): string | null {
      const regex = /^data:(.*\/.*);base64,/gm
      const result = regex.exec(this.image.src)
      if (!result) return null

      return result[1]
    },
    complete(): void {
      this.$emit('trimmed-image', this.trimmingImgSrc)
      this.hideTrimmingImageDialog()
    },
  },
})
</script>

<style scoped lang="scss">
.v-stepper {
  background: #1e1e1e;
}
</style>
