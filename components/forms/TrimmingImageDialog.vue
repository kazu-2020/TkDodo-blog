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
              <v-col cols="12">
                <span>使用したい画像をアップロードしてください。</span>
              </v-col>
              <v-col v-if="!image.src" cols="12">
                <image-input :image.sync="image" :file-type.sync="fileType" />
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
              <v-btn @click="clearImage">
                <v-icon left>mdi-cancel</v-icon>画像を変更する
              </v-btn>
              <v-btn class="ml-5" color="primary" @click="step = 2">
                次へ<v-icon right>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-row justify="center" align-content="center">
              <v-col cols="12">
                <span>使用したい範囲を選択してください。</span>
              </v-col>
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
              <v-btn @click="step = 1">
                <v-icon left>mdi-chevron-left</v-icon>戻る
              </v-btn>
              <v-btn class="ml-5" color="primary" @click="setCropperImage">
                次へ<v-icon right>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-row justify="center" align-content="center">
              <v-col cols="12">
                <span>生成される画像を確認してください。</span>
              </v-col>
              <v-col v-if="trimmingImgSrc" cols="auto">
                <img
                  alt=""
                  :src="trimmingImgSrc"
                  style="max-height: 400px; width: 852px; object-fit: contain"
                />
              </v-col>
              <v-col cols="12" class="text-center">
                <p>この画像をもとに下記サイズの画像を生成します。</p>
                <ul class="will-create-size-list">
                  <li
                    v-for="text in willCreateSizeTexts()"
                    :key="text"
                    class=""
                  >
                    {{ text }}
                  </li>
                </ul>
              </v-col>
            </v-row>

            <v-row justify="center">
              <v-btn large @click="step = 2">
                <v-icon left>mdi-chevron-left</v-icon>戻る
              </v-btn>
              <v-btn large class="ml-5" color="success" @click="complete">
                <v-icon left>mdi-check</v-icon>決定
              </v-btn>
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
  fileType: string
  trimmingImgSrc: string
  step: number
}

export default Vue.extend({
  name: 'TrimmingImageDialog',
  components: {
    VueCropper,
    ImageInput,
  },
  props: {
    isShowDialog: {
      type: Boolean,
      required: true,
    },
    aspectRatioDenominator: {
      type: Number,
      required: true,
    },
    aspectRatioNumerator: {
      type: Number,
      required: true,
    },
    trimmingImageType: {
      type: String,
      required: true,
    },
  },
  data(): DataType {
    return {
      image: {} as HTMLImageElement,
      fileType: '',
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
      this.trimmingImgSrc = (this.$refs.cropper as any)
        .getCroppedCanvas()
        .toDataURL(this.fileType)
      this.step = 3
    },
    clearImage(): void {
      this.image = {} as HTMLImageElement
      this.fileType = ''
    },
    complete(): void {
      this.$emit('trimmed-image', this.trimmingImgSrc)
      this.hideTrimmingImageDialog()
    },
    willCreateSizeTexts(): string[] | undefined {
      switch (this.trimmingImageType) {
        case 'logo':
          return ['縦1,080 ✕ 横1,080px', '縦640 ✕ 横640px', '縦200 ✕ 横200px']
        case 'eyecatch':
          return [
            '縦1,080 ✕ 横1,920px',
            '縦720 ✕ 横1,280px',
            '縦522 ✕ 横928px',
            '縦360 ✕ 横640px',
          ]
        case 'hero':
          return ['縦640 ✕ 横1,920px', '縦360 ✕ 横1080px']
      }
    },
  },
})
</script>

<style scoped lang="scss">
.v-stepper {
  background: #1e1e1e;
}
.v-stepper__header {
  box-shadow: none;
}
ul.will-create-size-list {
  list-style: none;
}
</style>
