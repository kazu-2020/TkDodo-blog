<template>
  <v-row>
    <v-col v-if="existsSameAs" cols="12">
      <v-row>
        <v-col cols="5">
          <v-text-field v-model="sameAsName" :rules="nameRules" label="名前" />
        </v-col>
        <v-col cols="5">
          <v-text-field v-model="sameAsUrl" :rules="urlRules" label="URL" />
        </v-col>
        <v-col cols="1">
          <v-btn color="error" class="mr-4" @click="removeSameAs"> 削除 </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col v-else cols="12">
      <v-btn class="mr-4" @click="addSameAs">
        <v-icon>mdi-plus</v-icon>
        リンク(同一内容)を追加
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { SameAs } from '@/types/same_as'

interface DataType {
  nameRules: Array<Function>
  urlRules: Array<Function>
}

export default Vue.extend({
  name: 'SameAsForm',
  props: {
    sameAs: {
      type: Object,
      required: false,
      default: () => {
        return {
          id: null,
          name: null,
          url: null,
          _destroy: 0,
        } as Object
      },
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
    existsSameAs(): boolean {
      return this.sameAsName !== null && this.sameAsUrl !== null
    },
    sameAsName: {
      get() {
        return ((this as any).sameAs as SameAs).name
      },
      set(value) {
        const that = this as any
        that.$emit('update:sameAs', {
          id: that.sameAs.id,
          name: value,
          url: that.sameAs.url,
          _destroy: 0,
        })
      },
    },
    sameAsUrl: {
      get() {
        return ((this as any).sameAs as SameAs).url
      },
      set(value) {
        const that = this as any
        that.$emit('update:sameAs', {
          id: that.sameAs.id,
          name: that.sameAs.name,
          url: value,
          _destroy: 0,
        })
      },
    },
  },
  methods: {
    addSameAs(): void {
      const that = this as any
      that.$emit('update:sameAs', {
        id: that.sameAs.id,
        name: '',
        url: '',
        _destroy: 0,
      })
    },
    removeSameAs(): void {
      const that = this as any
      that.$emit('update:sameAs', {
        id: that.sameAs.id,
        name: null,
        url: null,
        _destroy: 1,
      })
    },
  },
})
</script>
