<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card
            :tile="$vuetify.breakpoint.sm || $vuetify.breakpoint.xs"
            class="mx-auto fill-width"
            flat
            max-width="640"
          >
            <v-card-title class="text-center pa-8">
              <h4 class="fill-width">ログインステータス</h4>
            </v-card-title>
            <v-divider />
            <div class="py-8">
              <div style="max-width: 344px" class="mx-auto">
                <div class="separator separator_login_page">
                  <div class="middle_separator">
                    {{
                      $auth.loggedIn ? `${username} でログイン中` : '未ログイン'
                    }}
                  </div>
                </div>
                <div class="pt-6">
                  <div class="login-btn pb-8">
                    <v-btn
                      block
                      color="primary"
                      elevation="2"
                      x-large
                      @click="authAction"
                    >
                      {{ buttonText }}
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AuthIndex',
  auth: false,
  computed: {
    username() {
      if (this.$auth.$state.user && this.$auth.$state.user.name) {
        return this.$auth.$state.user.name
      } else {
        return null
      }
    },
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
