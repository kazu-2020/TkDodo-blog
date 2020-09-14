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

import CropperUtil from '@/utils/cropperUtil'

export default Vue.extend({
  name: 'Cropper', // vue-cropperのラッパーコンポーネント
  components: {
    VueCropper,
  },
  props: {
    aspectRatioDenominator: {
      type: Number,
      required: true,
    },
    aspectRatioNumerator: {
      type: Number,
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
      const adjustedSize: number[] = CropperUtil.getAdjustedSize(
        this.image.height,
        this.image.width
      )
      return adjustedSize[0]
    },
    adjustedWidth(): number {
      const adjustedSize: number[] = CropperUtil.getAdjustedSize(
        this.image.height,
        this.image.width
      )
      return adjustedSize[1]
    },
  },
  methods: {
    getCroppedCanvas(options?: CroppedCanvasOptions): HTMLCanvasElement {
      return (this.$refs.cropper as any).getCroppedCanvas(options)
    },
  },
})
</script>
