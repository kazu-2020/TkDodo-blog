import { storiesOf } from '@storybook/vue'
import { text } from '@storybook/addon-knobs/vue'
import Paragraph from '@/components/EditorBlocks/Paragraph.vue'

storiesOf('Components/EditorBlocks', module).add(
  'Paragraph',
  () => ({
    components: { Paragraph },
    template: `<paragraph :text="text" />`,
    props: {
      text: {
        type: String,
        default: text(
          'text',
          '普通のテキスト<br /><mark class="cdx-marker">マーカー</mark><br /><b>太字</b><br /><i>イタリック</i><br /><code class="inline-code">インラインコード</code><br /><a href="https://google.com">リンク</a>'
        ),
      },
    },
    description: {
      Paragraph: {
        props: {
          text:
            '表示するテキストおよびタグの文字列（タグ文字列は Editor.js で編集できるもののみ許容する',
        },
      },
    },
  }),
  {
    info: true,
    notes: `
        # Paragraph
        [Editor.js](https://editorjs.io/) で作成したブロックに対するコンポーネントです。
      `,
  }
)
