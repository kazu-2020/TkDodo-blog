<template>
  <div>
    <v-img :src="uploadImageUrl" class="thumbnail" />
    <v-file-input
      v-show="!disableInputForm"
      v-model="inputImage"
      accept="image/*"
      label="画像ファイルをアップロードしてください"
      prepend-icon="mdi-image"
      @change="onImagePicked"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

interface DataType {
  inputImage: null
  uploadImageUrl: String
}

const defaultImageUrl: String =
  'https://placehold.jp/9092b0/ffffff/150x150.png?text=No%20image'

export default Vue.extend({
  name: 'PlaylistThumbnail',
  props: {
    url: {
      type: String,
      default: `${defaultImageUrl}`,
    },
    disableInputForm: {
      type: Boolean,
      default: false,
    },
  },
  data(): DataType {
    return {
      inputImage: null,
      uploadImageUrl: this.url,
    }
  },
  methods: {
    onImagePicked(file: any) {
      if (file !== undefined && file !== null) {
        if (file.name.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(file)
        fr.addEventListener('load', () => {
          if (fr.result !== null) {
            this.uploadImageUrl = fr.result.toString()
          }
        })
      } else {
        this.uploadImageUrl = defaultImageUrl
      }
    },
  },
})
</script>

<style scoped>
.v-image.thumbnail {
  cursor: pointer;
}
</style>
