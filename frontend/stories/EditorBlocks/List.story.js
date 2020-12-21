import { storiesOf } from '@storybook/vue'
import { select, array } from '@storybook/addon-knobs/vue'
import List from '@/components/common/List.vue'

storiesOf('components/common', module).add(
  'List',
  () => ({
    components: { List },
    template: `<list :listStyle="listStyle" :items="items" />`,
    props: {
      listStyle: {
        type: String,
        default: select('listStyle', ['unordered', 'ordered']),
      },
      items: {
        type: Array,
        default: array('items', [
          'item1',
          'item2',
          'item3',
          '<mark class="cdx-marker">マーカー</mark>',
          '<b>太字</b>',
          '<i>イタリック</i>',
          '<code class="inline-code">インラインコード</code>',
          '<a href="https://google.com">リンク</a>',
        ]),
      },
    },
    description: {
      Paragraph: {
        props: {
          listStyle: '"unordered" または "ordered" を許容します',
          items:
            'リストに含まれるテキストの配列（Editor.js から出力されるHTMLを許可）',
        },
      },
    },
  }),
  {
    info: true,
    notes: `
        # List
        [Editor.js](https://editorjs.io/) で作成したブロックに対するコンポーネントです。
      `,
  }
)
