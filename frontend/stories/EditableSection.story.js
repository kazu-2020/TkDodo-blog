import { storiesOf } from '@storybook/vue'
import { text, object } from '@storybook/addon-knobs/vue'
import EditableSection from '@/components/common/EditableSection.vue'

storiesOf('Components/Editor', module).add(
  'EditableSection',
  () => ({
    components: { EditableSection },
    template: `<editable-section
        :section-id="sectionId"
        :initial-data="initialData"
      />`,
    props: {
      sectionId: {
        type: String,
        default: text('section-id', 'editor-block'),
      },
      initialData: {
        type: Object,
        default: object('initial-data', {
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
          ],
        }),
      },
    },
  }),
  {
    info: true,
    notes: `
        # EditableSection
        [Editor.js](https://editorjs.io/) をラップしたコンポーネントです

        ## Props
        * sectionId
          * string
            * Editor.js をマウントする HTML ID名の指定をします
        * initialData
          * object
            * 初期表示するデータを指定します
      `,
  }
)
