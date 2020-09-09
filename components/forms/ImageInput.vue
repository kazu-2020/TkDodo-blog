<template>
  <v-sheet class="image-input-wrapper" color="grey lighten-4">
    <div
      class="image-input"
      @dragover.prevent="onDrag('over')"
      @dragleave="onDrag('leave')"
      @drop.prevent="onDrop"
    >
      <input type="file" title @change="onChange" />
      <div class="d-flex justify-center">
        <v-icon v-if="!isDragOver" color="grey darken-2" size="75"
          >mdi-cloud-upload-outline</v-icon
        >
        <v-icon v-if="isDragOver" color="grey darken-2" size="75"
          >mdi-cloud-upload</v-icon
        >
      </div>
      <div class="text-center ml-5">
        <span class="title grey--text text--darken-2">
          クリック or ここにドラッグで画像をアップロード
          <br />
          (対応形式: jpg / jpeg / png)
        </span>
      </div>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
  isDragOver: boolean
}

export default Vue.extend({
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data(): DataType {
    return {
      isDragOver: false,
    }
  },
  computed: {
    image: {
      set(value: HTMLImageElement) {
        this.$emit('input', value)
      },
      get(): HTMLImageElement {
        return this.value
      },
    },
  },
  methods: {
    onDrag(type: string) {
      this.isDragOver = type === 'over'
    },
    onDrop(event: any) {
      this.isDragOver = false
      const files = event.dataTransfer.files
      if (files.length !== 1 || files[0].type.indexOf('image') !== 0) {
        return
      }
      this.readImage(files[0])
    },
    onChange(event: any) {
      const files = event.target.files
      if (files.length !== 1 || files[0].type.indexOf('image') !== 0) {
        return
      }
      this.readImage(files[0])
    },
    readImage(file: File) {
      const reader = new FileReader()
      reader.onload = this.loadImage
      reader.readAsDataURL(file)
    },
    loadImage(e: any) {
      const image = new Image()
      image.src = e.target.result
      this.image = image
    },
  },
})
</script>

<style scoped lang="scss">
.image-input-wrapper {
  height: 400px;
}
.image-input {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  > input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
