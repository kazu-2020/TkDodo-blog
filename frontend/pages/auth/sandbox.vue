<template>
  <v-layout column>
    <v-row>
      <v-col>
        <h1>Hello, {{ $auth.loggedIn ? 'login user!' : 'guest user!' }}!</h1>
        <v-btn @click="authAction">{{ buttonText }}</v-btn>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'AuthSandbox',
  computed: {
    buttonText(): string {
      if (this.$auth.loggedIn) {
        return 'ログアウトする'
      } else {
        return 'ログインする'
      }
    },
  },
  methods: {
    async authAction() {
      if (this.$auth.loggedIn) {
        await this.$auth.logout()
      } else {
        this.$auth.loginWith('auth0')
      }
    },
  },
})
</script>
