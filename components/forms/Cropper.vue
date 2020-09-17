<template>
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
</template>

<script lang="ts">
import Vue from 'vue'

import VueCropper, { CroppedCanvasOptions } from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

export default Vue.extend({
  name: 'Cropper', // vue-cropperのラッパーコンポーネント
  components: {
    VueCropper,
  },
  props: {
    trimmingImageType: {
      type: String,
      required: true,
    },
    image: {
      type: HTMLImageElement,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
  },
  computed: {
    aspectRatio(): number {
      return this.aspectRatioDenominator / this.aspectRatioNumerator
    },
    adjustedHeight(): number {
      const adjustedSize: number[] = this.getAdjustedSize(
        this.image.height,
        this.image.width
      )
      return adjustedSize[0]
    },
    adjustedWidth(): number {
      const adjustedSize: number[] = this.getAdjustedSize(
        this.image.height,
        this.image.width
      )
      return adjustedSize[1]
    },
    aspectRatioDenominator(): number {
      switch (this.trimmingImageType) {
        case 'logo':
          return 1
        case 'eyecatch':
          return 16
        case 'hero':
          return 3
        default:
          return 0
      }
    },
    aspectRatioNumerator(): number {
      switch (this.trimmingImageType) {
        case 'logo':
        case 'hero':
          return 1
        case 'eyecatch':
          return 9
        default:
          return 0
      }
    },
  },
  methods: {
    cropper(): any {
      return this.$refs.cropper
    },
    getCroppedCanvas(options?: CroppedCanvasOptions): HTMLCanvasElement {
      return (this.$refs.cropper as any).getCroppedCanvas(options)
    },
    /**
     * 引数で受け取った高さと幅から画面サイズにあわせた高さと幅を返す
     * 高さは 400px を基本として幅を計算するが、
     * 計算後の幅が 1,120px 以上の場合は幅を 1,120px として高さを計算する
     * @return 縦・横 のサイズ
     */
    getAdjustedSize(height: number, width: number): number[] {
      let adjustedHeight = 400 // 基本の高さ
      const maxWidth = 1120 // 最大画像幅
      let evenWidth: number = width // 偶数にした幅を代入するための変数

      if (width % 2 !== 0) {
        // NOTE: copper.jsは幅が奇数の場合に右に黒線が入ってしまうバグがあるため、奇数の場合は1px減らす
        evenWidth = width - 1
      }

      let adjustedWidth = (adjustedHeight * evenWidth) / height

      // 画像幅が1120px以上の場合、幅を1120pxに縮小
      if (adjustedWidth > maxWidth) {
        adjustedWidth = maxWidth
        adjustedHeight = (adjustedWidth * height) / evenWidth
      }

      return [adjustedHeight, adjustedWidth]
    },
  },
})
</script>
