<template>
  <v-row>
    <v-col cols="auto">
      <label class="text--secondary">ロゴ - Logo</label>
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
          <input
            id="logoImageFile"
            ref="logoImageInput"
            type="file"
            accept="image/*"
            style="display: none"
          />
        </v-card>
      </v-hover>
    </v-col>
    <v-col cols="auto">
      <label class="text--secondary">アイキャッチ - Eyecatch</label>
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
          <input
            id="eyecatchImageFile"
            ref="eyecatchImageInput"
            type="file"
            accept="image/*"
            style="display: none"
          />
        </v-card>
      </v-hover>
    </v-col>
    <v-col cols="auto">
      <label class="text--secondary">ヒーロー - Hero</label>
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
          <input
            id="heroImageFile"
            ref="heroImageInput"
            type="file"
            accept="image/*"
            style="display: none"
          />
        </v-card>
      </v-hover>
    </v-col>
    <v-col>
      <TrimmingImageDialog
        :is-show-dialog="isShowTrimmingImageDialog"
        :trimming-image-type="trimmingImageType"
        @hide-trimming-image-dialog="closeDialog"
        @trimmed-logo-image="trimmedLogoImage($event)"
        @trimmed-eyecatch-image="trimmedEyecatchImage($event)"
        @trimmed-hero-image="trimmedHeroImage($event)"
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
  isRemoveLogoImage: boolean
  isRemoveEyecatchImage: boolean
  isRemoveHeroImage: boolean
  isShowTrimmingImageDialog: boolean
  trimmingImageType: string
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
      isRemoveLogoImage: false,
      isRemoveEyecatchImage: false,
      isRemoveHeroImage: false,
      isShowTrimmingImageDialog: false,
      trimmingImageType: '',
    }
  },
  computed: {
    logoImageUrl(): string {
      if (this.isRemoveLogoImage) {
        return this.dummyImagePath('logo')
      }

      return (
        this.logoImageData ||
        this.playlist.logo?.medium?.url ||
        this.dummyImagePath('logo')
      )
    },
    eyecatchImageUrl(): string {
      if (this.isRemoveEyecatchImage) {
        return this.dummyImagePath('eyecatch')
      }

      return (
        this.eyecatchImageData ||
        this.playlist.eyecatch?.medium?.url ||
        this.dummyImagePath('eyecatch')
      )
    },
    heroImageUrl(): string {
      if (this.isRemoveHeroImage) {
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
      this.isRemoveLogoImage = true
      this.$emit('remove-series-image', 'logo')
    },
    removeEyecatchImage() {
      this.isRemoveEyecatchImage = true
      this.$emit('remove-series-image', 'eyecatch')
    },
    removeHeroImage() {
      this.isRemoveHeroImage = true
      this.$emit('remove-series-image', 'hero')
    },
    trimmedLogoImage(value: string) {
      this.logoImageData = value
      this.isRemoveLogoImage = false
      this.$emit('update-series-image', { type: 'logo', file: value })
    },
    trimmedEyecatchImage(value: string) {
      this.eyecatchImageData = value
      this.isRemoveEyecatchImage = false
      this.$emit('update-series-image', { type: 'eyecatch', file: value })
    },
    trimmedHeroImage(value: string) {
      this.heroImageData = value
      this.isRemoveHeroImage = false
      this.$emit('update-series-image', { type: 'hero', file: value })
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
