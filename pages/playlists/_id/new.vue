<template>
  <v-layout column>
    <v-row>
      <v-col>
        <div class="title mb-4">
          <h2>プレイリスト新規作成</h2>
        </div>
      </v-col>
    </v-row>
    <v-flex xs12 sm8 md6>
      <v-form ref="form" v-model="valid" :lazy-validation="lazy" class="ml-5">
        <h3>基本項目</h3>
        <v-text-field
          v-model="playlist.name"
          :counter="255"
          :rules="playlist.nameRules"
          label="名前 - Name"
          required
        />

        <v-text-field
          v-model="playlist.nameRuby"
          :counter="255"
          :rules="playlist.nameRubyRules"
          label="ふりがな - Detailed Name Ruby"
        />

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="validate"
        >
          Validate
        </v-btn>

        <v-btn color="error" class="mr-4" @click="reset">
          Reset Form
        </v-btn>

        <v-btn color="warning" @click="resetValidation">
          Reset Validation
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    valid: true,
    playlist: {
      id: null,
      name: null,
      nameRules: [
        (v: String) => !!v || '入力してください',
        (v: String) => (v && v.length <= 255) || '文字数が多すぎます。',
      ],
      nameRuby: null,
      nameRubyRules: [
        (v: String) => (v && v.length <= 255) || '文字数が多すぎます。',
      ],
    },
  }),
  methods: {
    validate() {
      const form: any = this.$refs.form
      form.validate()
    },
    reset() {
      const form: any = this.$refs.form
      form.reset()
    },
    resetValidation() {
      const form: any = this.$refs.form
      form.resetValidation()
    },
  },
})
</script>
