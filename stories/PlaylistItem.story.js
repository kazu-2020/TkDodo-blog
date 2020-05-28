import { storiesOf } from '@storybook/vue'
import { object } from '@storybook/addon-knobs/vue'
import PlaylistItem from '@/components/PlaylistItem.vue'

storiesOf('Components/Playlist', module).add(
  'PlaylistItem',
  () => ({
    components: { PlaylistItem },
    template: `<playlist-item
        :playlist="playlist"
      />`,
    props: {
      playlist: {
        type: Object,
        default: object('playlist', {
          title: 'hoge',
          updated_at: '2020-05-20 00:00:00',
          id: 1,
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
