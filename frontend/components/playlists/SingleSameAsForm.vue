<template>
  <v-row v-if="!isDestroyed" class="py-0 px-4">
    <v-col cols="5">
      <v-text-field
        v-model="name"
        :rules="nameRules"
        label="名前"
        class="same-as-name"
      />
    </v-col>
    <v-col cols="5">
      <v-text-field
        v-model="url"
        :rules="urlRules"
        label="URL"
        class="same-as-url"
      />
    </v-col>
    <v-col cols="1">
      <v-btn color="error" class="mr-4" @click="removeSameAs">削除</v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
  nameRules: Array<Function>
  urlRules: Array<Function>
}

export default Vue.extend({
  name: 'SingleSameAsForm',
  props: {
    sameAs: {
      type: Object,
      required: true,
      default: () => {},
    },
    sameAsIndex: {
      type: Number,
      required: true,
    },
  },
  data(): DataType {
    return {
      nameRules: [
        (v: String) => !!v || '名前は必ず入力してください',
        (v: String) =>
          (v && v.length <= 255) || '名前は255文字以下で入力してください',
      ],
      urlRules: [
        (v: String) => !!v || 'URLは必ず入力してください',
        (v: String) =>
          (v && v.length <= 255) || 'URLは255文字以下で入力してください',
      ],
    }
  },
  computed: {
    isDestroyed(): boolean {
      return (this.sameAs as any)._destroy === 1
    },
    name: {
      get() {
        return (this as any).sameAs.name
      },
      set(value) {
        const that = this as any
        that.$emit('update-name', {
          sameAsIndex: that.sameAsIndex,
          id: that.sameAs.id,
          name: value,
          url: that.sameAs.url,
          _destroy: 0,
        })
      },
    },
    url: {
      get() {
        return (this as any).sameAs.url
      },
      set(value) {
        const that = this as any
        that.$emit('update-url', {
          sameAsIndex: that.sameAsIndex,
          id: that.sameAs.id,
          name: that.sameAs.name,
          url: value,
          _destroy: 0,
        })
      },
    },
  },
  methods: {
    removeSameAs(): void {
      const that = this as any
      this.$emit('remove-same-as', {
        sameAsIndex: that.sameAsIndex,
        id: that.sameAs.id,
        name: null,
        url: null,
        _destroy: 1,
      })
    },
  },
})
</script>

<style lang="scss" scoped></style>
