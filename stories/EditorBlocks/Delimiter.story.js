import { storiesOf } from '@storybook/vue'
import Delimiter from '@/components/EditorBlocks/Delimiter.vue'

storiesOf('Components/EditorBlocks', module).add(
  'Delimiter',
  () => ({
    components: { Delimiter },
    template: `<delimiter />`,
  }),
  {
    info: true,
    notes: `
        # Delimiter
        [Editor.js](https://editorjs.io/) で作成したブロックに対するコンポーネントです。
      `,
  }
)
