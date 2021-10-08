<template>
  <v-dialog v-model="dialog" scrollable width="620px">
    <template #activator="{ on }">
      <v-btn :color="buttonColor" icon small class="dialog_button" v-on="on">
        <v-icon>mdi-view-dashboard-outline</v-icon>
      </v-btn>
    </template>
    <v-card class="playlist_json_dialog">
      <v-card-title>
        <span class="headline"> layoutPattern </span>
        <small class="ml-3 font-weight-bold">
          <a
            :href="`${apiBaseUrl}/oembed?url=https://dev-www-eh.nr.nhk.jp/p/pl/${playlistId}`"
            target="_blank"
            >oEmbed API</a
          >
          <v-icon>mdi-open-in-new</v-icon>
        </small>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <h2 class="mb-2">
                Summary<small>
                  <a
                    :href="`${apiBaseUrl}/embed/pl/${playlistId}?layout_pattern=summary`"
                    class="ml-2"
                    target="_blank"
                    >contents</a
                  >
                  <v-icon>mdi-open-in-new</v-icon>
                </small>
              </h2>
              <iframe
                width="100%"
                height="210"
                :src="`${apiBaseUrl}/embed/pl/${playlistId}?layout_pattern=summary`"
                style="border: 0"
              />
            </v-col>
            <v-col cols="12">
              <h2 class="mb-2">
                FeaturedItem
                <small>
                  <a
                    :href="`${apiBaseUrl}/embed/pl/${playlistId}?layout_pattern=featuredItem`"
                    class="ml-2"
                    target="_blank"
                    >contents</a
                  >
                  <v-icon>mdi-open-in-new</v-icon>
                </small>
              </h2>
              <iframe
                width="240"
                height="385"
                :src="`${apiBaseUrl}/embed/pl/${playlistId}?layout_pattern=featuredItem`"
                style="border: 0"
              />
            </v-col>
            <v-col cols="12">
              <h2 class="mb-2">
                ItemList
                <small>
                  <a
                    :href="`${apiBaseUrl}/embed/pl/${playlistId}?layout_pattern=itemList`"
                    class="ml-2"
                    target="_blank"
                    >contents</a
                  >
                  <v-icon>mdi-open-in-new</v-icon>
                </small>
              </h2>
              <iframe
                width="240"
                height="210"
                :src="`${apiBaseUrl}/embed/pl/${playlistId}?layout_pattern=itemList`"
                style="border: 0"
              />
            </v-col>
            <v-col cols="12">
              <h2 class="mb-2">LargeImage</h2>
              <p>準備中</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false"> 閉じる </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LayoutPatternDialog',
  props: {
    buttonColor: {
      type: String,
      required: false,
      default: '#FFFFFF',
    },
    playlistId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {
    apiBaseUrl(): string {
      return process.env.apiBaseUrl || ''
    },
  },
})
</script>
