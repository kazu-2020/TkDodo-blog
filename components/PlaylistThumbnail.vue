<template>
  <div>
    <v-img :src="uploadImageUrl" class="thumbnail" />
    <v-file-input
      v-model="inputImage"
      accept="image/*"
      label="画像ファイルをアップロードしてください"
      prepend-icon="mdi-image"
      @change="onImagePicked"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class PlaylistThumbnail extends Vue {
  @Prop({ type: String, required: false })
  url?: string

  inputImage = null
  defaultImageUrl =
    'https://placehold.jp/9092b0/ffffff/150x150.png?text=No%20image'

  uploadImageUrl = this.url || this.defaultImageUrl

  onImagePicked(file: any) {
    if (file !== undefined && file !== null) {
      if (file.name.lastIndexOf('.') <= 0) {
        return
      }
      const fr = new FileReader()
      fr.readAsDataURL(file)
      fr.addEventListener('load', () => {
        this.uploadImageUrl = fr.result
      })
    } else {
      this.uploadImageUrl = this.defaultImageUrl
    }
  }
}
</script>

<style scoped>
.v-image.thumbnail {
  cursor: pointer;
}
</style>
