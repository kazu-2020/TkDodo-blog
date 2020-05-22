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

export default {
  components: {
    'editable-section': EditableSection,
    draggable,
  },
  asyncData() {
    return axios.get('/api/playlisticles/sandbox').then(res => {
      return { sections: res.data.playlisticle.sections }
    })
  },
  data() {
    return {
      selectedSection: null,
      sections: [],
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
