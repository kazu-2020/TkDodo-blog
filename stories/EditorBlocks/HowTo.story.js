import { storiesOf } from '@storybook/vue'
import { object } from '@storybook/addon-knobs/vue'
import HowTo from '@/components/EditorBlocks/HowTo.vue'

storiesOf('Components/EditorBlocks', module).add(
  'HowTo',
  () => ({
    components: { HowTo },
    template: `<how-to :how-to-data="howToData" :series-data="seriesData" :episode-data="episodeData" />`,
    props: {
      howToData: {
        type: Object,
        default: object('how-to-data', {
          name: 'アイスが溶けそう～！myボトルマーカーの作り方',
          description:
            'ペットボトルのふたにつけて、自分の物だと一目でわかるようにするボトルマーカー。アイスをモチーフにした遊び心あふれる形で作ってみませんか。材料は100円ショップでも手に入るプラスチック粘土。お湯で柔らかくして形を作っていきます。',
          image: [
            {
              thumbnail: [
                {
                  url:
                    'https://www.nhk.or.jp/lifestyle/article/detail/gpsf94000000gwzg-img/hero.jpg',
                },
              ],
            },
          ],
        }),
      },
      seriesData: {
        type: Object,
        default: object('series-data', {
          name: 'ガールズクラフト',
          episodes: [
            {
              name: '「キラキラ輝く!サボテンブローチ」',
              detailedRecentEvent: {
                publishedOn: {
                  images: {
                    badgeSmall: {
                      url:
                        'https://dev-www.nhk.jp/assets/images/broadcastservice/bs/e1/e1-badge_s.png',
                    },
                  },
                },
              },
            },
          ],
          style: {
            textLight: '#000000',
            textDark: '#FFFFFF',
            linkLight: '#B65B5D',
            linkDark: '#FF8082',
            primaryLight: '#E47374',
            primaryDark: '#FF8082',
          },
        }),
      },
    },
    description: {
      HowTo: {
        props: {
          howToData: 'API から返却されるハウツーデータ',
          seriesData: 'API から返却されるハウツーに紐づくシリーズデータ',
        },
      },
    },
  }),
  {
    info: true,
    notes: `
        # HowTo
        [Editor.js](https://editorjs.io/) で作成したブロックに対するコンポーネントです。
      `,
  }
)
