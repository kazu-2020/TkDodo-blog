<template>
  <div class="editor-sandbox">
    <div class="title">
      Editor.js Sandbox(ブロック型)
    </div>
    <v-divider class="ma-2" />
    <draggable element="ul" :animation="500">
      <li
        v-for="section in sections"
        :key="section.id"
        class="draggable-handle"
      >
        <editable-section
          :section-id="section.id"
          :initial-data="section.data"
        />
      </li>
    </draggable>
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
      sections: [
        {
          id: 'editor1',
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
