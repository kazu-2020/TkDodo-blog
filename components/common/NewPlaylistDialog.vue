<template>
  <v-dialog v-model="isShow" max-width="600px" persistent>
    <v-card>
      <v-container>
        <v-row>
          <v-col cols="10" sm="10" md="10">
            <v-card-title>
              <span class="headline">プレイリストの新規作成</span>
            </v-card-title>
          </v-col>
          <v-col cols="2" sm="2" md="2">
            <v-card-actions>
              <v-btn color="text" text @click="hideNewPlaylistDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
        <v-row justify="center" align-content="center">
          <v-col cols="1" />
          <v-col cols="5">
            <div class="rounded_border_button" @click="moveToNewPlaylistPage">
              <div class="content">
                <div class="type_icon">
                  <v-icon>mdi-playlist-plus</v-icon>
                </div>
                <br />
                <p class="type_description">
                  エピソードリストから<br />新規作成
                </p>
              </div>
            </div>
          </v-col>
          <v-col cols="5">
            <div class="rounded_border_button" @click="moveToNewArticlePage">
              <div class="content">
                <div class="type_icon">
                  <v-icon>mdi-note-text-outline</v-icon>
                </div>
                <br />
                <p class="type_description short">記事から新規作成</p>
              </div>
            </div>
          </v-col>
          <v-col cols="1" />
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

interface DataType {
  isShow: boolean
  loadingDialog: boolean
}

export default Vue.extend({
  name: 'NewPlaylistDialog',
  components: {},
  props: {
    isShowDialog: {
      type: Boolean,
      required: false,
    },
  },
  data(): DataType {
    return {
      isShow: false,
      loadingDialog: false,
    }
  },
  watch: {
    isShowDialog: {
      handler(newVal: boolean) {
        this.isShow = newVal
      },
      immediate: true,
    },
  },
  methods: {
    hideNewPlaylistDialog() {
      this.isShow = false
      this.loadingDialog = false
      this.$emit('hide-new-playlist-dialog')
    },
    moveToNewPlaylistPage() {
      this.hideNewPlaylistDialog()
      this.$router.push(`/playlists/newList`)
    },
    moveToNewArticlePage() {
      this.hideNewPlaylistDialog()
      this.$router.push(`/playlists/newArticle`)
    },
  },
})
</script>

<style lang="scss" scoped>
.rounded_border_button {
  border-radius: 5px;
  border: thin solid rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: all 0.4s ease-in-out;
  position: relative;
  width: 100%;

  &:before {
    content: '';
    display: block;
    padding-top: 75%;
  }

  &:hover {
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.12);
  }

  .content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}

.type_icon {
  text-align: center;
  margin-top: 20px;

  i {
    font-size: 3em;
  }
}

.type_description {
  text-align: center;

  &.short {
    margin-top: 16px;
  }
}
</style>
