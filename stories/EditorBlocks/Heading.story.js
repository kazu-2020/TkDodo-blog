import { storiesOf } from '@storybook/vue'
import { text, number } from '@storybook/addon-knobs/vue'
import Heading from '@/components/EditorBlocks/Heading.vue'

storiesOf('Components/EditorBlocks', module).add(
  'Heading',
  () => ({
    components: { Heading },
    template: `<heading :level="level">{{ text }}</heading>`,
    props: {
      level: {
        type: Number,
        default: number('level', 1),
      },
      text: {
        type: String,
        default: text('text', 'Sample'),
      },
    },
    description: {
      Heading: {
        props: {
          level: 'H{n} タグに対する n になります',
        },
      },
    },
  }),
  {
    info: true,
    notes: `
        # Heading
        [Editor.js](https://editorjs.io/) で作成したブロックに対するコンポーネントです。

        ## Option
        * text
          * String
            * ストーリーボードで表示を試す用のテキストです
      `,
  }
)
