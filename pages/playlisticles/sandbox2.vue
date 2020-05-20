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
            <v-subheader>Sections</v-subheader>
            <v-list-item-group color="primary">
              <draggable
                animation="500"
                @start="drag = true"
                @end="drag = false"
              >
                <v-list-item
                  v-for="section in sections"
                  :key="section.id"
                  @click="switchSelectedSection(section)"
                >
                  <v-list-item-icon>
                    <v-icon v-text="section.icon" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="section.text" />
                  </v-list-item-content>
                </v-list-item>
              </draggable>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col xs="12" sm="12" md="8" lg="8">
          <editable-section
            v-if="selectedSection"
            :key="selectedSection.id"
            :section-id="selectedSection.id"
            :initial-data="selectedSection.data"
            @modify-content="updateSectionData"
          />
        </v-col>
      </v-row>
    </v-layout>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import EditableSection from '~/components/EditableSection.vue'

// APIから取得する用のサンプルデータ
import episodeSampleJson from '~/assets/json/episode_LR3P5RJ389.json'
import eventSampleJson from '~/assets/json/event_LR3P5RJ389.json'

export default {
  components: {
    'editable-section': EditableSection,
    draggable,
  },
  data() {
    return {
      selectedSection: null,
      sections: [
        {
          id: 'editor1',
          icon: 'mdi-drag',
          text: 'Section1',
          data: {
            time: 1589951040948,
            blocks: [
              {
                type: 'header',
                data: {
                  text: 'Section1',
                  level: 2,
                },
              },
              {
                type: 'paragraph',
                data: {
                  text: 'Section 1 のテキストです。',
                },
              },
              {
                type: 'episode',
                data: episodeSampleJson,
              },
            ],
          },
        },
        {
          id: 'editor2',
          icon: 'mdi-drag',
          text: 'Section2',
          data: {
            time: 1589951040948,
            blocks: [
              {
                type: 'header',
                data: {
                  text: 'Section2',
                  level: 2,
                },
              },
              {
                type: 'paragraph',
                data: {
                  text: 'Section 2 のテキストです。',
                },
              },
              {
                type: 'tvEvent',
                data: eventSampleJson,
              },
            ],
          },
        },
        {
          id: 'editor3',
          icon: 'mdi-drag',
          text: 'Section3',
          data: {
            time: 1589951040948,
            blocks: [
              {
                type: 'header',
                data: {
                  text: 'Section3',
                  level: 2,
                },
              },
              {
                type: 'paragraph',
                data: {
                  text: 'Section 3 のテキストです。',
                },
              },
            ],
          },
        },
      ],
    }
  },
  methods: {
    switchSelectedSection(section) {
      this.selectedSection = this.sections.find(s => s.id === section.id)
    },
    updateSectionData(updatedSectionData) {
      this.sections.find(s => s.id === updatedSectionData.sectionId).data =
        updatedSectionData.editorData
      console.log(updatedSectionData.editorData)
    },
  },
}
</script>

<style scoped>
li.draggable-handle {
  padding-left: 50px;
  border-left: 10px solid white;
  margin-top: 10px;
  margin-bottom: 10px;
  list-style-type: none;
}
</style>
