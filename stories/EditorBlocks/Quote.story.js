import { storiesOf } from '@storybook/vue'
import { text, select } from '@storybook/addon-knobs/vue'
import Quote from '@/components/common/Quote.vue'

storiesOf('components/common', module).add(
  'Quote',
  () => ({
    components: { Quote },
    template: `<quote :text="text" :caption="caption" :alignment="alignment" />`,
    props: {
      text: {
        type: String,
        default: text('text', 'Done is better than perfect.'),
      },
      caption: {
        type: String,
        default: text('caption', 'マーク・ザッカーバーグ'),
      },
      alignment: {
        type: String,
        default: select('alignment', ['left', 'center']),
      },
    },
    description: {
      Quote: {
        props: {
          text: '引用のテキスト',
          caption: '引用のテキストに対する注記',
          alignment: 'left または center を許容します',
        },
      },
    },
  }),
  {
    info: true,
    notes: `
        # Quote
        [Editor.js](https://editorjs.io/) で作成したブロックに対するコンポーネントです。
      `,
  }
)
