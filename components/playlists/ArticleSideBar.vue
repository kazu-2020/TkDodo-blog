<template>
  <div>
    <v-sheet color="grey lighten-3" rounded class="pb-2 mb-1">
      <iconed-title
        icon="mdi-account-edit"
        title="編集者情報の入力"
        class="ma-4 pt-4"
      />
      <hr class="title_divider" />
      <v-sheet color="white" class="ma-4 pa-4" rounded>
        <v-form ref="form" v-model="valid">
          <h4>著者情報</h4>
          <v-radio-group
            v-model="editableAuthorType"
            row
            mandatory
            hide-details
          >
            <v-radio label="個人" value="Person" />
            <v-radio label="グループ" value="Organization" />
          </v-radio-group>
          <v-text-field v-model="editableAuthorName" :rules="[required]" />
          <h4>提供者</h4>
          <v-text-field v-model="editablePublisher" :rules="[required]" />
        </v-form>
      </v-sheet>
    </v-sheet>
    <v-sheet color="grey lighten-3" rounded class="pb-2 mb-1">
      <iconed-title
        icon="mdi-content-save"
        title="記事を保存する"
        class="ma-4 pt-4"
      />
      <hr class="title_divider" />
      <v-sheet color="white" class="ma-4 pa-4" rounded>
        <v-btn
          block
          rounded
          outlined
          class="mb-4"
          color="pink darken-3"
          @click.stop="clickPreviewButton"
        >
          プレビューを見る
        </v-btn>

        <v-btn
          block
          rounded
          class="mb-4 white--text"
          color="pink darken-3"
          :disabled="!valid"
          @click.stop="clickSaveButton"
        >
          この内容で保存する
        </v-btn>

        <hr class="button_divider" />

        <v-btn
          v-show="isPresisted"
          block
          text
          class="delete_button mt-2"
          @click="notifyDummy"
        >
          <v-icon small>mdi-delete</v-icon>
          <div class="delete_button_title">削除する</div>
        </v-btn>
      </v-sheet>
    </v-sheet>
    <v-sheet v-show="isPresisted" color="grey lighten-3" rounded class="pb-1">
      <iconed-title
        icon="mdi-key"
        title="記事の公開設定をする"
        class="ma-4 pt-4"
      />
      <hr class="title_divider" />
      <v-sheet color="white" class="ma-4 pa-4" rounded>
        <div class="mb-4">
          現在の設定:
          <v-chip label color="grey lighten-1">非公開</v-chip>
        </div>
        <v-btn
          block
          rounded
          class="mb-4 white--text"
          color="light-blue darken-3"
          @click.stop="notifyDummy"
        >
          公開する
        </v-btn>
      </v-sheet>
    </v-sheet>
  </div>
</template>

<script lang="js">
import Vue from 'vue'
import IconedTitle from '~/components/common/IconedTitle.vue'

export default Vue.extend({
  name: 'ArticleSideBar',
  components: {
    IconedTitle,
  },
  props: {
    saveAsNewPlaylist: {
      type: Boolean,
      default: false,
    },
    authorType: {
      type: String,
      required: true,
      default: 'Organization'
    },
    authorName: {
      type: String,
      required: true,
      default: 'デジタルラボ',
    },
    publisher: {
      type: String,
      required: true,
      default: 'NHK',
    },
  },
  data() {
    return {
      required: value => !!value || "必ず入力してください",
      valid: true,
    }
  },
  computed: {
    isPresisted() {
      return !this.saveAsNewPlaylist
    },
    editableAuthorName: {
      get() {
        return this.authorName
      },
      set(value) {
        this.$emit('update:author-name', value)
        this.valid = this.$refs.form.validate()
      },
    },
    editableAuthorType: {
      get() {
        return this.authorType
      },
      set(value) {
        this.$emit('update:author-type', value)
        this.valid = this.$refs.form.validate()
      },
    },
    editablePublisher: {
      get() {
        return this.publisher
      },
      set(value) {
        this.$emit('update:publisher', value)
        this.valid = this.$refs.form.validate()
      },
    },
  },
  methods: {
    clickPreviewButton() {
      this.$emit('click-preview-button')
    },
    clickSaveButton() {
      this.$emit('click-save-button')
    },
    notifyDummy() {
      this.$emit('notify-dummy')
    },
  }
})
</script>

<style scoped>
.title_divider {
  border: none;
  border-top: solid 2px #bdbdbd;
  height: 1px;
}

.button_divider {
  border: none;
  border-top: solid 1px #bdbdbd;
  height: 1px;
}

.delete_button_title {
  text-decoration: underline;
}

.delete_button {
  color: #757575;
}
</style>
