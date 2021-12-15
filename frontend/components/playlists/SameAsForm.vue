<template>
  <v-row>
    <v-col
      v-for="(sa, index) in sameAs"
      :key="`same-as-${index}`"
      cols="12"
      class="pa-0"
    >
      <single-same-as-form
        :same-as="sa"
        :same-as-index="index"
        @update-name="updateName"
        @update-url="updateUrl"
        @remove-same-as="removeSameAs"
      />
    </v-col>
    <v-col cols="12">
      <v-btn class="mr-4 add-same-as" @click="addSameAs">
        <v-icon>mdi-plus</v-icon>
        リンク(同一内容)を追加
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import SingleSameAsForm from '~/components/playlists/SingleSameAsForm.vue'

export default Vue.extend({
  name: 'SameAsForm',
  components: {
    SingleSameAsForm,
  },
  props: {
    sameAs: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    addSameAs(): void {
      this.$emit(
        'update:sameAs',
        this.sameAs.slice().concat([{ name: '', url: '', _destroy: 0 }])
      )
    },
    removeSameAs(sa: any): void {
      const newSameAs = this.sameAs.slice()
      newSameAs.splice(sa.sameAsIndex, 1, sa)

      const that = this as any
      that.$emit('update:sameAs', newSameAs)
    },
    updateName(sa: any): void {
      const newSameAs = this.sameAs.slice()
      newSameAs.splice(sa.sameAsIndex, 1, sa)

      const that = this as any
      that.$emit('update:sameAs', newSameAs)
    },
    updateUrl(sa: any): void {
      const newSameAs = this.sameAs.slice()
      newSameAs.splice(sa.sameAsIndex, 1, sa)

      const that = this as any
      that.$emit('update:sameAs', newSameAs)
    },
  },
})
</script>

<style lang="scss" scoped></style>
