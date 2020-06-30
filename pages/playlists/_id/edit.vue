<template>
  <v-row>
    <v-col cols="12">
      <div class="title mb-4">
        <h2>プレイリスト新規作成</h2>
      </div>
      <v-form ref="form" v-model="valid" class="ml-5">
        <v-row dense>
          <v-col cols="12">
            <h3>基本項目</h3>
          </v-col>
          <v-col cols="12">
            <v-radio-group
              v-model="playlist.publish_state"
              :mandatory="true"
              row
            >
              <v-radio label="非公開" value="0" checked="true" />
              <v-radio label="公開" value="1" />
            </v-radio-group>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="playlist.name"
              :rules="playlist.nameRules"
              label="名前 - Name"
              required
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="playlist.nameRuby"
              :rules="playlist.nameRubyRules"
              label="ふりがな - Detailed Name Ruby"
            />
          </v-col>
          <v-row flex-start>
            <v-col cols="6" md="3">
              <v-select
                v-model="playlist.formatGenre"
                :items="formatGenres"
                label="ジャンル(フォーマット) - Format Genre"
              />
            </v-col>
            <v-col cols="6" md="3">
              <v-select
                v-model="playlist.themeGenre"
                :items="themeGenres"
                label="ジャンル(テーマ) - Theme Genre"
              />
            </v-col>
          </v-row>
          <v-col cols="12">
            <v-textarea
              name="catch"
              rows="3"
              label="キャッチコピー - Detailed Catch"
              value=""
              hint="Hint text"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              name="catch"
              rows="5"
              label="説明 - Description"
              counter=""
              value=""
              hint="Hint text"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="playlist.keywords"
              label="キーワード - Keywords"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="playlist.hashtags"
              label="ハッシュタグ - Hashtag"
              hint="タグの先頭に「#」をつけてください。スペース区切りで複数のタグが登録可能です。"
            />
          </v-col>
        </v-row>

        <v-row dense class="my-5">
          <v-col cols="12">
            <h3>画像</h3>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <playlist-thumbnail />
          </v-col>
        </v-row>

        <!-- 色 -->
        <v-row dense class="my-5">
          <v-col cols="12">
            <h3>色 - Color</h3>
            <p>
              ここで選んだ色がアクセシビリティに配慮された色に変換されページに反映されます
            </p>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="12" class="d-flex flex-row">
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#faf100"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#f6aa00"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#ff2800"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#990099"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#005aff"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#03af7a"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#ff8082"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#4dc4ff"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#804000"
                  class="mr-4"
                />
                <v-sheet
                  width="40"
                  height="40"
                  elevation="4"
                  color="#84919e"
                  class="mr-4"
                />
                <v-sheet width="40" height="40" elevation="4" color="white" />
              </v-col>
            </v-row>
            <v-row justify="start" align="center">
              <v-col class="shrink" style="min-width: 220px;">
                <v-text-field
                  v-model="color"
                  v-mask="mask"
                  hide-details
                  class="ma-0 pa-0"
                  solo
                >
                  <template v-slot:append>
                    <v-menu
                      v-model="menu"
                      top
                      nudge-bottom="105"
                      nudge-left="16"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <div :style="swatchStyle" v-on="on" />
                      </template>
                      <v-card>
                        <v-card-text class="pa-0">
                          <v-color-picker v-model="color" flat />
                        </v-card-text>
                      </v-card>
                    </v-menu>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- detailedTimeTable -->
        <v-row dense class="my-5">
          <v-col cols="12">
            <h3>
              タイムテーブル
              <small class="text--secondary"> - Detailed Time Table</small>
            </h3>
          </v-col>

          <v-col cols="12" class="mb-0">
            <v-row
              v-for="timeTable in playlist.detailedTimeTables"
              :key="timeTable.id"
            >
              <v-col cols="3">
                <v-select
                  v-model="timeTable.serviceId"
                  :items="services"
                  required
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="timeTable.description"
                  :rules="nameRules"
                  label="説明 - Description"
                />
              </v-col>
              <v-col cols="3">
                <v-checkbox v-model="timeTable.isRerun" label="再放送" />
              </v-col>
              <v-col cols="1">
                <v-btn
                  color="error"
                  class="mr-4"
                  @click="removeDetailedTimeTable(timeTable)"
                >
                  削除
                </v-btn>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-btn class="mr-4" @click="addDetailedTimeTable">
              <v-icon>mdi-plus</v-icon>
              タイムテーブルを追加
            </v-btn>
          </v-col>
        </v-row>

        <!-- sameAs -->
        <v-row dense class="my-5">
          <v-col cols="12">
            <h3>
              リンク(同一内容)<small class="text--secondary"> - SameAs</small>
            </h3>
          </v-col>
          <v-col cols="12">
            <v-row v-for="sameAs in playlist.sameAs" :key="sameAs.id">
              <v-col cols="5">
                <v-text-field
                  v-model="sameAs.name"
                  :rules="nameRules"
                  label="名前"
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="sameAs.url"
                  :rules="nameRules"
                  label="URL"
                />
              </v-col>
              <v-col cols="1">
                <v-btn color="error" class="mr-4" @click="removeSameAs(sameAs)">
                  削除
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-btn class="mr-4" @click="addSameAs">
              <v-icon>mdi-plus</v-icon>
              リンク(同一内容)を追加
            </v-btn>
          </v-col>
        </v-row>

        <!-- citations -->
        <v-row dense class="my-5">
          <v-col cols="12">
            <h3>
              関連リンク<small class="text--secondary"> - Citation</small>
            </h3>
          </v-col>
          <v-col cols="12">
            <v-row v-for="citation in playlist.citations" :key="citation.id">
              <v-col cols="5">
                <v-text-field
                  v-model="citation.name"
                  :rules="nameRules"
                  label="名前"
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="citation.url"
                  :rules="nameRules"
                  label="URL"
                />
              </v-col>
              <v-col cols="1">
                <v-btn
                  color="error"
                  class="mr-4"
                  @click="removeCitation(citation)"
                >
                  削除
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-btn class="mr-4" @click="addCitation">
              <v-icon>mdi-plus</v-icon>
              関連リンクを追加
            </v-btn>
          </v-col>
        </v-row>

        <!-- role -->
        <v-row dense class="my-5">
          <v-col cols="12">
            <h3>
              出演者・関係者<small class="text--secondary"> - Role</small>
            </h3>
          </v-col>
          <v-col cols="12">
            <v-card color="gray" outlined tile height="150">
              TODO
            </v-card>
          </v-col>
        </v-row>

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
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import PlaylistThumbnail from '~/components/PlaylistThumbnail.vue'

interface DetailedTimeTable {
  serviceId: string
  description: string
  isRerun: boolean
}

interface Citation {
  name: string
  url: string
}

interface SameAs {
  name: string
  url: string
}

export default Vue.extend({
  components: {
    PlaylistThumbnail,
  },
  data: () => ({
    valid: true,
    playlist: {
      id: null,
      publish_state: 0,
      // シリーズ相当メタ
      name: null,
      nameRules: [
        (v: String) => !!v || 'Name is required',
        (v: String) =>
          (v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
      nameRuby: null,
      nameRubyRules: [
        (v: String) =>
          (v && v.length <= 255) || 'Name must be less than 255 characters',
      ],
      formatGenre: null,
      themeGenre: null,
      detailedCatch: null,
      sameAs: [], // { name, url }
      citations: [], // { name, url }
      detailedTimeTables: [], // { serviceId, description, isRerun }
      hashtags: [], // { name: '' }
      keywords: [],
      roles: [],
      colors: null, // TODO
      // 公開系
      publishedStartDate: null,
      publishedEndDate: null,
      isPublish: false,
    },
    services: [
      { value: 'g1', text: '総合1' },
      { value: 'g2', text: '総合2' },
      { value: 'e1', text: 'Eテレ1' },
      { value: 'e2', text: 'Eテレ2' },
      { value: 'e3', text: 'Eテレ3' },
      { value: 's1', text: 'BS1' },
      { value: 's2', text: 'BS1' },
      { value: 's3', text: 'BSプレミアム' },
      { value: 's4', text: 'BSプレミアム' },
      { value: 's5', text: 'BS4K' },
      { value: 's6', text: 'BS8K' },
    ],
    formatGenres: [
      { value: '00', text: 'ジャンルレス' },
      { value: '01', text: '報道' },
      { value: '02', text: 'ドキュメンタリー' },
      { value: '03', text: 'ドラマ' },
      { value: '04', text: 'アニメ' },
      { value: '05', text: 'バラエティ' },
      { value: '06', text: '映画' },
      { value: '08', text: 'PR・お知らせ' },
      { value: '09', text: '講座' },
    ],
    themeGenres: [
      { value: '020', text: 'スポーツ全般' },
      { value: '070', text: '音楽全般' },
      { value: '092', text: '自然' },
      { value: '093', text: '科学' },
      { value: '096', text: '芸術' },
      { value: '110', text: '福祉全般' },
    ],
    color: '#FFFFFF',
    mask: '!#XXXXXXXX',
    menu: false,
  }),
  computed: {
    swatchStyle() {
      const { color, menu } = this
      return {
        backgroundColor: color,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        borderRadius: menu ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out',
      }
    },
  },
  methods: {
    addDetailedTimeTable() {
      const detailedTimeTables: Array<DetailedTimeTable> = this.playlist
        .detailedTimeTables
      detailedTimeTables.push({
        serviceId: 'g1',
        description: '',
        isRerun: false,
      })
    },
    removeDetailedTimeTable(timeTable: DetailedTimeTable) {
      const detailedTimeTables: Array<DetailedTimeTable> = this.playlist
        .detailedTimeTables
      detailedTimeTables.splice(detailedTimeTables.indexOf(timeTable), 1)
    },
    addSameAs() {
      const sameAsList: Array<SameAs> = this.playlist.sameAs
      sameAsList.push({
        name: '',
        url: '',
      })
    },
    removeSameAs(sameAs: SameAs) {
      const sameAsList: Array<SameAs> = this.playlist.sameAs
      sameAsList.splice(sameAsList.indexOf(sameAs), 1)
    },
    addCitation() {
      const citations: Array<Citation> = this.playlist.citations
      citations.push({
        name: '',
        url: '',
      })
    },
    removeCitation(citation: Citation) {
      const citations: Array<Citation> = this.playlist.citations
      citations.splice(citations.indexOf(citation), 1)
    },
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
