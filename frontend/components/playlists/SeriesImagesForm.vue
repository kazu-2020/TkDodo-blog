<template>
  <v-row>
    <v-col cols="auto">
      <span style="color: red">※</span
      ><label
        :class="{
          'text--secondary': isUploadedLogo,
          'error--text': !isUploadedLogo,
        }"
        >ロゴ - Logo</label
      >
      <div v-if="!isUploadedLogo" class="v-text-field__details">
        <div class="v-messages theme--light error--text" role="alert">
          <div class="v-messages__wrapper">
            <div class="v-messages__message">画像は必ず登録してください</div>
          </div>
        </div>
      </div>
      <v-hover v-slot="{ hover }">
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
        </v-card>
      </v-hover>
    </v-col>
    <v-col cols="auto">
      <span style="color: red">※</span>
      <label
        :class="{
          'text--secondary': isUploadedEyecatch,
          'error--text': !isUploadedEyecatch,
        }"
        >アイキャッチ - Eyecatch</label
      >
      <div v-if="!isUploadedEyecatch" class="v-text-field__details">
        <div class="v-messages theme--light error--text" role="alert">
          <div class="v-messages__wrapper">
            <div class="v-messages__message">画像は必ず登録してください</div>
          </div>
        </div>
      </div>
      <v-hover v-slot="{ hover }">
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
        </v-card>
      </v-hover>
    </v-col>
    <v-col cols="auto">
      <span style="color: red">※</span>
      <label
        :class="{
          'text--secondary': isUploadedHero,
          'error--text': !isUploadedHero,
        }"
        >ヒーロー - Hero</label
      >
      <div v-if="!isUploadedHero" class="v-text-field__details">
        <div class="v-messages theme--light error--text" role="alert">
          <div class="v-messages__wrapper">
            <div class="v-messages__message">画像は必ず登録してください</div>
          </div>
        </div>
      </div>
      <v-hover v-slot="{ hover }">
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
        </v-card>
      </v-hover>
    </v-col>
    <v-col>
      <TrimmingImageDialog
        :is-show-dialog="isShowTrimmingImageDialog"
        :trimming-image-type="trimmingImageType"
        @hide-trimming-image-dialog="closeDialog"
        @trimmed-logo-image="trimmedLogoImage"
        @trimmed-eyecatch-image="trimmedEyecatchImage"
        @trimmed-hero-image="trimmedHeroImage"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment'
import TrimmingImageDialog from '~/components/playlists/TrimmingImageDialog.vue'

interface DataType {
  logoImageData: string
  eyecatchImageData: string
  heroImageData: string
  isRemovedLogoImage: boolean
  isRemovedEyecatchImage: boolean
  isRemovedHeroImage: boolean
  isShowTrimmingImageDialog: boolean
  trimmingImageType: string
  isValidSeriesTab: boolean
  isUploadedLogo: boolean
  isUploadedEyecatch: boolean
  isUploadedHero: boolean
}

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
      isRemovedLogoImage: false,
      isRemovedEyecatchImage: false,
      isRemovedHeroImage: false,
      isShowTrimmingImageDialog: false,
      trimmingImageType: '',
      isValidSeriesTab: true,
      isUploadedLogo: true,
      isUploadedEyecatch: true,
      isUploadedHero: true,
    }
  },
  computed: {
    logoImageUrl(): string {
      if (this.isRemovedLogoImage) {
        return this.dummyImagePath('logo')
      }

      return (
        this.logoImageData ||
        this.playlist.logo?.medium?.url ||
        this.dummyImagePath('logo')
      )
    },
    eyecatchImageUrl(): string {
      if (this.isRemovedEyecatchImage) {
        return this.dummyImagePath('eyecatch')
      }

      return (
        this.eyecatchImageData ||
        this.playlist.eyecatch?.medium?.url ||
        this.dummyImagePath('eyecatch')
      )
    },
    heroImageUrl(): string {
      if (this.isRemovedHeroImage) {
        return this.dummyImagePath('hero')
      }

      return (
        this.heroImageData ||
        this.playlist.hero?.medium?.url ||
        this.dummyImagePath('hero')
      )
    },
  },
  methods: {
    openDialog(type: string) {
      this.trimmingImageType = type
      this.isShowTrimmingImageDialog = true
    },
    closeDialog() {
      this.trimmingImageType = ''
      this.isShowTrimmingImageDialog = false
    },
    removeLogoImage() {
      this.isRemovedLogoImage = true
      this.isUploadedLogo = false
      this.$emit('remove-series-image', 'logo', this.isUploadedLogo)
    },
    removeEyecatchImage() {
      this.isRemovedEyecatchImage = true
      this.isUploadedEyecatch = false
      this.$emit('remove-series-image', 'eyecatch', this.isUploadedEyecatch)
    },
    removeHeroImage() {
      this.isRemovedHeroImage = true
      this.isUploadedHero = false
      this.$emit('remove-series-image', 'hero', this.isUploadedHero)
    },
    trimmedLogoImage(value: string, isUploadedImage: boolean) {
      this.logoImageData = value
      this.isRemovedLogoImage = false
      this.isUploadedLogo = isUploadedImage
      this.$emit(
        'update-series-image',
        { type: 'logo', file: value },
        isUploadedImage
      )
    },
    trimmedEyecatchImage(value: string, isUploadedImage: boolean) {
      this.eyecatchImageData = value
      this.isRemovedEyecatchImage = false
      this.isUploadedEyecatch = isUploadedImage
      this.$emit(
        'update-series-image',
        { type: 'eyecatch', file: value },
        isUploadedImage
      )
    },
    trimmedHeroImage(value: string, isUploadedImage: boolean) {
      this.heroImageData = value
      this.isRemovedHeroImage = false
      this.isUploadedHero = isUploadedImage
      this.$emit(
        'update-series-image',
        { type: 'hero', file: value },
        isUploadedImage
      )
    },
    dummyImagePath(type: string) {
      const time = this.playlist.dateCreated
      const logoNumber = (Number(moment(time).format('DD')) % 10) + 1
      return `/dummy/default${logoNumber}/default${logoNumber}-${type}.png`
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
