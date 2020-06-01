<template>
  <div class="editor-sandbox">
    <div class="title">
      Editor.js Sandbox2(アウトライン型)
    </div>
    <v-divider class="ma-2" />
    <v-layout column>
      <v-row>
        <v-col xs="12" sm="12" md="4" lg="4">
          <v-list>
            <v-list-item-group color="primary">
              <v-subheader>Header</v-subheader>
              <v-list-item @click="switchSelectedSection(headerSection)">
                <v-list-item-icon>
                  <v-icon v-text="headerSection.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="headerSection.text" />
                </v-list-item-content>
              </v-list-item>
              <v-subheader>Sections</v-subheader>
              <draggable
                animation="500"
                @start="drag = true"
                @end="drag = false"
              >
                <v-list-item
                  v-for="section in bodySections"
                  :key="section.id"
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
                      <v-list>
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
              <v-list-item @click="switchSelectedSection(footerSection)">
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
            v-if="selectedSection"
            :key="selectedSection.id"
            :section-id="selectedSection.id"
            :initial-data="selectedSection.data"
            :episode-block-id="episodeBlockId(selectedSection)"
            :require-episode-block="isRequireEpisodeBlock(selectedSection)"
            @modify-content="updateSectionData"
          />
        </v-col>
      </v-row>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'
import draggable from 'vuedraggable'
import EditableSection from '~/components/EditableSection.vue'
import sampleEventData from '~/assets/json/event_LR3P5RJ389.json'
import sampleHowToData from '~/assets/json/howTo_G9218G45GJ.json'
import sampleEpisodeData from '~/assets/json/episode_LR3P5RJ389.json'
import sampleRecipeData from '~/assets/json/recipe.json'
import editorBlockMixin from '~/components/mixins/editorBlockMixin'

export default {
  components: {
    'editable-section': EditableSection,
    draggable,
  },
  mixins: [editorBlockMixin],
  asyncData() {
    return axios.get('/api/playlisticles/sandbox').then(res => {
      return { sections: res.data.playlisticle.sections }
    })
  },
  data() {
    return {
      selectedSection: null,
      sections: [],
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
    headerSection() {
      return this.sections.length !== 0
        ? this.sections.filter(s => s.type === 'header')[0]
        : undefined
    },
    footerSection() {
      return this.sections.length !== 0
        ? this.sections.filter(s => s.type === 'footer')[0]
        : undefined
    },
    bodySections() {
      return this.sections.length !== 0
        ? this.sections.filter(s => s.type === 'body')
        : undefined
    },
    playlisticle() {
      return this.$store.state.playlisticles.editingPlaylisticle
    },
  },
  methods: {
    switchSelectedSection(section) {
      this.selectedSection = this.sections.find(s => s.id === section.id)
    },
    updateSectionData(updatedSectionData) {
      this.sections.find(s => s.id === updatedSectionData.sectionId).data =
        updatedSectionData.editorData
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
    isRequireEpisodeBlock(selectedSection) {
      return selectedSection.type === 'body'
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
</style>
