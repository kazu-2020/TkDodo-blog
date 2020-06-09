import { storiesOf } from '@storybook/vue'
import { object } from '@storybook/addon-knobs/vue'
import TvEvent from '@/components/EditorBlocks/TvEvent.vue'

storiesOf('Components/EditorBlocks', module).add(
  'TvEvent',
  () => ({
    components: { TvEvent },
    template: `<tv-event :event-data="eventData" :series-data="seriesData" />`,
    props: {
      eventData: {
        type: Object,
        default: object('event-data', {
          name: 'あわ怪人をやっつけよう',
          image: {
            medium: {
              url:
                'https://dev-cms1.nr.nhk.jp/static/assets/images/event/te/LR3P5RJ389/LR3P5RJ389-eyecatch_ad2f18c3428a2cedfc4c6efc722b539d.png',
            },
          },
          startDate: '2020-06-08T05:45:00+09:00',
          endDate: '2020-06-08T06:00:00+09:00',
          location: 'ストレッチ小学校',
          address: '東京都千代田区千代田１−１',
          url: 'https://www.nhk.jp/p/ts/QLZLXN22G2/episode/te/KWVQLP1LLL/',
        }),
      },
      seriesData: {
        type: Object,
        default: object('series-data', {
          name: 'ストレッチマン・ゴールド',
          episodes: [
            {
              name: '「しっかり手洗いしよう」 ',
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
            linkLight: '#E72400',
            linkDark: '#FF4928',
            primaryLight: '#FF2800',
            primaryDark: '#FF2800',
          },
        }),
      },
    },
    description: {
      TvEvent: {
        props: {
          eventData: 'API から返却されるイベントデータ',
          seriesData: 'API から返却されるイベントに紐づくシリーズデータ',
        },
      },
    },
  }),
  {
    info: true,
    notes: `
        # TvEvent
        [Editor.js](https://editorjs.io/) で作成したブロックに対するコンポーネントです。
      `,
  }
)
