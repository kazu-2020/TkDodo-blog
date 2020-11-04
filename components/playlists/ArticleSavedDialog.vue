<template>
  <v-dialog v-model="isShowDialog" max-width="750px" persistent>
    <v-card>
      <v-container>
        <v-row justify="end">
          <v-col cols="2" sm="2" md="2">
            <v-card-actions>
              <v-btn color="text" text @click="hideDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="10">
            <div class="title text-center">記事の保存が完了しました</div>
          </v-col>
        </v-row>
        <v-row justify="center" align="center">
          <v-col cols="2">
            <v-icon class="large-icon" color="orange">mdi-check-circle</v-icon>
          </v-col>
        </v-row>
        <v-row justify="center" class="my-8">
          <v-col cols="5" class="left-pane">
            <p class="body-2">
              プレイリストにないエピソードがあります。
              <br />
              プレイリスト編集画面で追加できます。
            </p>
            <v-btn :to="playlistUrl" outlined color="orange">
              <v-icon left> mdi-pencil </v-icon>
              プレイリスト編集画面へ
            </v-btn>
          </v-col>
          <v-col cols="5" class="right-pane">
            <ul class="body-2 no-circle">
              <li
                v-for="(item, index) in omittedDiffItems"
                :key="`diff-${index}`"
                class="ellipsis"
              >
                <v-icon v-show="!(index === 3 && shouldOmmitDiffItems)" small
                  >mdi-monitor</v-icon
                >
                {{ item.name }}
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'ArticleSavedDialog',
  props: {
    isShowDialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    playlist: {
      type: Object,
      required: true,
      default: () => {},
    },
    diffItems: {
      type: Array as PropType<object[]>,
      required: true,
      default: () => [],
    },
  },
  computed: {
    playlistUrl(): string {
      return `/playlists/${this.playlist?.id}`
    },
    shouldOmmitDiffItems(): boolean {
      return this.diffItems.length > 4
    },
    omittedDiffItems(): Array<Object> {
      if (this.shouldOmmitDiffItems) {
        const items = this.diffItems.slice(0, 3)
        items.push({
          name: `その他 ${this.diffItems.length - 3}件のエピソード`,
        })

        return items
      } else {
        return this.diffItems.slice(0, 4)
      }
    },
  },
  methods: {
    hideDialog() {
      this.$emit('hide-new-playlist-dialog')
    },
  },
})
</script>

<style lang="scss">
.v-icon.large-icon {
  font-size: 75px;
}
</style>

<style lang="scss" scoped>
.left-pane {
  border-radius: 5px 0 0 5px;
  border: 1px solid black;
  border-width: 1px 0 1px 1px;
}

.right-pane {
  border-radius: 0 5px 5px 0;
  border: 1px solid black;
  border-width: 1px 1px 1px 0;
}

.no-circle {
  list-style: none;
}

.ellipsis {
  width: 264px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
