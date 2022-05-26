<template>
  <v-dialog v-model="isShow" class="mx-auto" persistent max-width="920px">
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
              color="text"
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
          <v-stepper-step :complete="step > 1" step="1">
            <div class="step_label">
              画像
              <br />
              アップロード
            </div>
          </v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="step > 2" step="2">
            <div class="step_label">範囲選択</div>
          </v-stepper-step>
          <v-divider />
          <v-stepper-step step="3"
            ><div class="step_label">確認</div></v-stepper-step
          >
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-row>
              <v-col cols="6">
                <span>使用したい画像をアップロードしてください。</span>
              </v-col>
              <v-col cols="6">
                <v-select
                  ref="filledImageTypeSelect"
                  :items="filledImageTypeList"
                  label="トリミング不可の画像は選択"
                  dense
                  outlined
                  clearable
                  @change="filledImageType = $event"
                />
              </v-col>

              <v-col v-if="!inputImage.src" cols="12">
                <image-input
                  :image.sync="inputImage"
                  :file-type.sync="fileType"
                />
              </v-col>
              <v-col v-if="inputImage.src" cols="12">
                <v-row justify="center">
                  <v-col cols="auto">
                    <img
                      alt=""
                      :src="inputImage.src"
                      height="400"
                      style="object-fit: contain"
                      class="bg-pattern-checker"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row v-if="inputImage.src" justify="center" class="mb-3">
              <v-btn @click="clearImage">
                <v-icon left>mdi-cancel</v-icon>画像を変更する
              </v-btn>
              <v-btn class="ml-5" color="primary" @click="toStep2">
                次へ<v-icon right>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-row justify="center" align-content="center">
              <v-col cols="12">
                <span>使用したい範囲を選択してください。</span>
              </v-col>
              <v-col v-if="isStep2Ready" cols="auto">
                <cropper
                  ref="cropper"
                  :image="image"
                  :mime-type="fileType"
                  :trimming-image-type="trimmingImageType"
                />
              </v-col>
            </v-row>

            <v-row justify="center" class="mb-3">
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
              <v-col v-if="isTrimmedImageReady">
                <v-row>
                  <v-col cols="auto">
                    <v-img
                      :src="trimmedImage"
                      width="852"
                      max-height="400"
                      class="bg-pattern-checker"
                      contain
                    />
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <p>この画像をもとに下記サイズの画像を生成します。</p>
                    <ul class="will-create-size-list">
                      <li
                        v-for="text in willCreateSizeTexts(trimmingImageType)"
                        :key="text"
                        class=""
                      >
                        {{ text }}
                      </li>
                    </ul>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-row justify="center" class="mb-3">
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

import ImageInput from './ImageInput.vue'
import Cropper from './Cropper.vue'
import { createFilledBackgroundImageSrc } from '~/utils/trimmingImage'

interface DataType {
  inputImage: HTMLImageElement
  image: HTMLImageElement
  fileType: string
  trimmedLogoImage: string
  trimmedEyecatchImage: string
  trimmedHeroImage: string
  step: number
  filledImageType: string
  filledImageTypeList: Array<Object>
  isShow: boolean
  isUploadedLogo: boolean
  isUploadedEyecatch: boolean
  isUploadedHero: boolean
}

export default Vue.extend({
  name: 'TrimmingImageDialog',
  components: {
    Cropper,
    ImageInput,
  },
  props: {
    isShowDialog: {
      type: Boolean,
      required: true,
    },
    trimmingImageType: {
      type: String,
      required: true,
    },
  },
  data(): DataType {
    return {
      inputImage: {} as HTMLImageElement,
      image: {} as HTMLImageElement,
      fileType: '',
      trimmedLogoImage: '',
      trimmedEyecatchImage: '',
      trimmedHeroImage: '',
      step: 1,
      filledImageType: '',
      filledImageTypeList: [
        {
          value: 'dominant',
          text: '背景を画像から抽出した色で埋める',
        },
        {
          value: 'black',
          text: '背景を黒で埋める',
        },
        {
          value: 'white',
          text: '背景を白で埋める',
        },
      ],
      isShow: false,
      isUploadedLogo: false,
      isUploadedEyecatch: false,
      isUploadedHero: false,
    }
  },
  computed: {
    trimmedImage(): string {
      switch (this.trimmingImageType) {
        case 'logo':
          return this.trimmedLogoImage
        case 'eyecatch':
          return this.trimmedEyecatchImage
        case 'hero':
          return this.trimmedHeroImage
        default:
          return ''
      }
    },
    isStep2Ready(): boolean {
      return this.step === 2 && !!this.image.src
    },
    isTrimmedImageReady(): boolean {
      switch (this.trimmingImageType) {
        case 'logo':
          return !!this.trimmedLogoImage
        case 'eyecatch':
          return !!this.trimmedEyecatchImage
        case 'hero':
          return !!this.trimmedHeroImage
        default:
          return false
      }
    },
  },
  watch: {
    isShowDialog: {
      handler(newVal: boolean) {
        this.isShow = newVal
      },
      immediate: true,
    },
  },
  methods: {
    hideTrimmingImageDialog(): void {
      this.isShow = false
      this.step = 1
      this.clearImage()
      this.$emit('hide-trimming-image-dialog')
    },
    async toStep2() {
      this.image = new Image()
      this.image.src = this.inputImage.src

      if (this.filledImageType) {
        await this.fillImageBackground()
      }
      this.step = 2
    },
    setCropperImage(): void {
      const croppedCanvasOptions = {
        maxWidth: 2880,
        maxHeight: 2880,
      }

      switch (this.trimmingImageType) {
        case 'logo':
          this.trimmedLogoImage = (this.$refs.cropper as any)
            .getCroppedCanvas(croppedCanvasOptions)
            .toDataURL(this.fileType)
          break
        case 'eyecatch':
          this.trimmedEyecatchImage = (this.$refs.cropper as any)
            .getCroppedCanvas(croppedCanvasOptions)
            .toDataURL(this.fileType)
          break
        case 'hero':
          this.trimmedHeroImage = (this.$refs.cropper as any)
            .getCroppedCanvas(croppedCanvasOptions)
            .toDataURL(this.fileType)
          break
      }
      this.step = 3
    },
    clearImage(): void {
      this.inputImage = {} as HTMLImageElement
      this.image = {} as HTMLImageElement
      this.trimmedLogoImage = ''
      this.trimmedEyecatchImage = ''
      this.trimmedHeroImage = ''
      this.fileType = ''
      this.filledImageType = (this.$refs.filledImageTypeSelect as any)?.reset()
    },
    complete(): void {
      switch (this.trimmingImageType) {
        case 'logo':
          this.isUploadedLogo = true
          this.$emit(
            'trimmed-logo-image',
            this.trimmedLogoImage,
            this.isUploadedLogo
          )
          break
        case 'eyecatch':
          this.isUploadedEyecatch = true
          this.$emit(
            'trimmed-eyecatch-image',
            this.trimmedEyecatchImage,
            this.isUploadedEyecatch
          )
          break
        case 'hero':
          this.isUploadedHero = true
          this.$emit(
            'trimmed-hero-image',
            this.trimmedHeroImage,
            this.isUploadedHero
          )
          break
      }
      this.hideTrimmingImageDialog()
    },
    willCreateSizeTexts(type: string): string[] | undefined {
      switch (type) {
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
    async fillImageBackground(): Promise<void> {
      let ratio: number[] = []
      switch (this.trimmingImageType) {
        case 'logo':
          ratio = [1, 1]
          break
        case 'eyecatch':
          ratio = [16, 9]
          break
        case 'hero':
          ratio = [3, 1]
          break
      }
      this.image.src = await createFilledBackgroundImageSrc(
        this.image,
        this.fileType,
        ratio,
        this.filledImageType
      )
    },
  },
})
</script>

<style scoped lang="scss">
.step_label {
  text-align: center;
}

.v-stepper__header {
  box-shadow: none;
}
ul.will-create-size-list {
  list-style: none;
}

.bg-pattern-checker {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
  background-color: #ffffff;
  background-repeat: repeat;
}
</style>
