<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-sheet class="ivory-background">
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
              loading="true"
              transition="scale-transition"
            />
          </v-sheet>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AuthLogin',
  mounted() {
    this.$auth.loginWith('auth0')
  },
})
</script>

<style scoped lang="scss">
.ivory-background {
  background-color: #f0f0f0;
}
</style>
