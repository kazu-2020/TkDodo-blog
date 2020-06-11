<template>
  <div class="editor-sandbox">
    <div class="title">
      Editor.js Sandbox(Word風)
      <v-btn
        class="ml-2"
        @click.stop="isShowPreviewDrawer = !isShowPreviewDrawer"
      >
        <v-icon class="mr-2">
          mdi-eye
        </v-icon>
        Preview
      </v-btn>
    </div>
    <v-divider class="ma-2" />
    <v-layout column>
      <v-row>
        <v-col xs="12" sm="12" md="4" lg="4">
          <v-list
            dense
            rounded
            :style="stickyMaxHeight"
            class="overflow-y-auto section_outline"
            :class="stickyClass"
          >
            <v-list-item-group color="blue-grey lighten-1">
              <v-subheader>Header</v-subheader>
              <v-list-item
                v-if="headerSection"
                @click="switchSelectedSection(headerSection)"
              >
                <v-list-item-icon>
                  <v-icon v-text="headerSection.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="headerSection.text" />
                </v-list-item-content>
              </v-list-item>
              <v-subheader>Sections</v-subheader>
              <draggable
                v-if="bodySections"
                v-model="bodySections"
                animation="500"
                @start="drag = true"
                @end="drag = false"
                @change="onSectionPositonChanged"
              >
                <v-list-item
                  v-for="section in bodySections"
                  :key="section.id"
                  :class="isNotSelectedSection(section) ? '' : 'highligted'"
                  @click.stop="switchSelectedSection(section)"
                >
                  <v-list-item-icon>
                    <v-icon v-text="section.icon" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="section.text" />
                  </v-list-item-content>
                  <div class="text-center">
                    <v-menu
                      open-on-hover
                      top
                      offset-x
                      transition="slide-x-transition"
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn
                          small
                          outlined
                          :disabled="isNotSelectedSection(section)"
                          v-on="on"
                        >
                          <v-icon>{{ iconOf(section) }}</v-icon>
                        </v-btn>
                      </template>
                      <v-list dense rounded color="grey darken-3">
                        <div
                          v-for="(typeItem, index) in typeItems"
                          :key="index"
                        >
                          <v-subheader>
                            <v-icon class="episode_type_icon">
                              {{ typeItem.icon }}
                            </v-icon>
                            {{ typeItem.displayName }}
                          </v-subheader>
                          <v-list-item
                            v-for="(item, index2) in typeItem.items"
                            :key="'item' + index2"
                            @click="replaceToSelectedSectionData(section, item)"
                          >
                            <v-list-item-title>
                              {{ item.title }}
                            </v-list-item-title>
                          </v-list-item>
                        </div>
                      </v-list>
                    </v-menu>
                  </div>
                </v-list-item>
              </draggable>
              <v-subheader>Footer</v-subheader>
              <v-list-item
                v-if="footerSection"
                @click="switchSelectedSection(footerSection)"
              >
                <v-list-item-icon>
                  <v-icon v-text="footerSection.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="footerSection.text" />
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col xs="12" sm="12" md="8" lg="8">
          <editable-section
            v-if="headerSection"
            :key="headerSection.id"
            :section-id="headerSection.id"
            :initial-data="headerSection.data"
            :episode-block-id="makeEpisodeBlockId(headerSection)"
            :require-episode-block="false"
            @modify-content="updateHeaderSectionData"
          />
          <v-divider class="mt-10" />
          <div v-for="section in bodySections" :key="section.id">
            <editable-section
              v-if="section"
              :key="section.id"
              :section-id="section.id"
              :initial-data="section.data"
              :episode-block-id="makeEpisodeBlockId(section)"
              :require-episode-block="true"
              @modify-content="updateBodySectionData"
            />
            <v-divider class="mt-10" />
          </div>
          <editable-section
            v-if="footerSection"
            :key="footerSection.id"
            :section-id="footerSection.id"
            :initial-data="footerSection.data"
            :episode-block-id="makeEpisodeBlockId(footerSection)"
            :require-episode-block="false"
            @modify-content="updateFooterSectionData"
          />
        </v-col>
      </v-row>
    </v-layout>
    <preview-drawer
      :key="combineEditorJson().time"
      :is-show-drawer="isShowPreviewDrawer"
      :preview-data="combineEditorJson()"
      @current-drawer-state="updatePreviewDrawerState"
    />
  </div>
</template>

<script>
import axios from 'axios'
import draggable from 'vuedraggable'
import EditableSection from '~/components/EditableSection.vue'
import PreviewDrawer from '~/components/PreviewDrawer.vue'
import sampleEventData from '~/assets/json/event_LR3P5RJ389.json'
import sampleHowToData from '~/assets/json/howTo_G9218G45GJ.json'
import sampleEpisodeData from '~/assets/json/episode_LR3P5RJ389.json'
import sampleRecipeData from '~/assets/json/recipe.json'
import editorBlockMixin from '~/components/mixins/editorBlockMixin'

export default {
  components: {
    'editable-section': EditableSection,
    'preview-drawer': PreviewDrawer,
    draggable,
  },
  mixins: [editorBlockMixin],
  asyncData() {
    return axios.get('/api/playlisticles/sandbox_word').then(res => {
      return {
        headerSection: res.data.playlisticle.headerSection,
        bodySections: res.data.playlisticle.bodySections,
        footerSection: res.data.playlisticle.footerSection,
      }
    })
  },
  data() {
    return {
      isShowPreviewDrawer: false,
      scrollY: 0,
      stickyMaxHeight: 0,
      stickyClass: '',
      selectedSection: null,
      headerSection: {},
      bodySections: [],
      footerSection: {},
      typeItems: [
        {
          type: 'episode',
          displayName: 'エピソード',
          icon: 'mdi-television',
          items: [
            {
              type: 'episode',
              title: '「しっかり手洗いしよう」',
              data: sampleEpisodeData,
            },
          ],
        },
        {
          type: 'recipe',
          displayName: 'レシピ',
          icon: 'mdi-silverware-fork-knife',
          items: [
            {
              type: 'recipe',
              title: '「新ごぼうで和おかず 新ごぼうのフレッシュきんぴら」',
              data: sampleRecipeData,
            },
          ],
        },
        {
          type: 'tvEvent',
          displayName: 'イベント',
          icon: 'mdi-calendar-month',
          items: [
            {
              type: 'tvEvent',
              title: '2020年5月13日 - あわ怪人をやっつけよう',
              data: sampleEventData,
            },
          ],
        },
        {
          type: 'howTo',
          displayName: 'ハウツー',
          icon: 'mdi-hammer-wrench',
          items: [
            {
              type: 'howTo',
              title: 'アイスが溶けそう～！myボトルマーカーの作り方',
              data: sampleHowToData,
            },
          ],
        },
      ],
    }
  },
  computed: {
    playlisticle() {
      return this.$store.state.playlisticles.editingPlaylisticle
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)

    this.stickyMaxHeight = `max-height: ${window.innerHeight - 200}px;`
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    switchSelectedSection(section) {
      this.jumpToSection(section)

      if (section.type === 'body') {
        this.selectedSection = this.bodySections.find(s => s.id === section.id)
      } else {
        this.selectedSection = {}
      }
    },
    jumpToSection(section) {
      this.$scrollTo(`#editor-${section.id}`, 700, {
        easing: [0, 0, 0.1, 1],
        offset: -75,
      })
    },
    updateHeaderSectionData(updatedSectionData) {
      this.headerSection.data = updatedSectionData.editorData
    },
    updateBodySectionData(updatedSectionData) {
      this.bodySections.find(s => s.id === updatedSectionData.sectionId).data =
        updatedSectionData.editorData
    },
    updateFooterSectionData(updatedSectionData) {
      this.footerSection.data = updatedSectionData.editorData
    },
    replaceToSelectedSectionData(section, item) {
      section.data.time = Date.now()
      section.data.blocks.find(b => this.isEpisodeRelatedBlock(b.type)).type =
        item.type
      section.data.blocks.find(b => this.isEpisodeRelatedBlock(b.type)).data =
        item.data
    },
    iconOf(section) {
      const sectionType = this.typeOfEpisodeRelatedBlock(section)
      return this.typeItems.find(item => item.type === sectionType).icon
    },
    isNotSelectedSection(section) {
      return section !== this.selectedSection
    },
    handleScroll() {
      this.scrollY = window.scrollY
      this.stickyClass = window.scrollY > 50 ? 'stickey' : ''
    },
    handleResize() {
      this.stickyHeight = window.innerHeight
    },
    onSectionPositonChanged({ moved }) {
      this.switchSelectedSection(moved.element)
    },
    updatePreviewDrawerState(newVal) {
      this.isShowPreviewDrawer = newVal
    },
    combineEditorJson() {
      const combindedJson = { time: Date.now(), blocks: [] }

      for (const block of this.headerSection.data.blocks) {
        combindedJson.blocks.push(block)
      }

      for (const bodySection of this.bodySections) {
        for (const block of bodySection.data.blocks) {
          combindedJson.blocks.push(block)
        }
      }

      for (const block of this.footerSection.data.blocks) {
        combindedJson.blocks.push(block)
      }

      return combindedJson
    },
  },
}
</script>

<style scoped lang="scss">
li.draggable-handle {
  padding-left: 50px;
  border-left: 10px solid white;
  margin-top: 10px;
  margin-bottom: 10px;
  list-style-type: none;
}

.v-subheader {
  height: auto;
  font-size: 0.7em;
  padding: 16px 16px 8px 16px;

  .episode_type_icon {
    margin-right: 8px;
  }
}

.v-list.section_outline {
  background-color: #e0e0e0;

  .theme--dark & {
    background-color: #424242;
  }

  &.stickey {
    position: sticky;
    top: 80px;
  }
}

.v-item--active.v-list-item--active {
  background: none;
  color: white;

  &::before {
    opacity: 0;
  }
}

.v-list-item.highligted {
  &::before {
    opacity: 0.28;
  }
}
</style>
