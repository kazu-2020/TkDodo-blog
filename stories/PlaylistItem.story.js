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
          id: 1,
          name: 'プレイリスト1',
          updated_at: '2020-05-20 00:00:00',
        }),
      },
    },
  }),
  {
    info: true,
    notes: `
        # PlaylistItem
        プレイリスト一覧など、プレイリストをリストで表示する際に使うリスト型アイテムです

        ## Props
        * playlist
          * object
            * id, name, updated_at を含むデータ
      `,
  }
)
