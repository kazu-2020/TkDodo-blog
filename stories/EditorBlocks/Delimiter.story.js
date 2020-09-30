import { storiesOf } from '@storybook/vue'
import Delimiter from '@/components/common/Delimiter.vue'

storiesOf('components/common', module).add(
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
