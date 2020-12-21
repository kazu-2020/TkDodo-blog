import { storiesOf } from '@storybook/vue'
import { object } from '@storybook/addon-knobs/vue'
import Episode from '@/components/common/Episode.vue'

storiesOf('components/common', module).add(
  'Episode',
  () => ({
    components: { Episode },
    template: `<episode :episode="episode" />`,
    props: {
      episode: {
        type: Object,
        default: object('episode', {
          name: '「前髪」',
          description:
            '倉科さんに続き、松岡広大さん、野崎智子さんと新キャラが続々と登場！今どきの若者たちに手を焼く倉科さんが「誰か助けて！」と絶叫する！ ▽今日のお題は「濃い」▽キュートな桜田ひよりさんの英語解説も必見です▽英単語の豆知識を紹介する語学コメディードラマ▽ラジオ・アプリとも連動した企画▽詳しくは「ＮＨＫゴガク」へ',
          eyecatch: {
            medium: {
              url:
                'https://www.nhk.jp/static/assets/images/tvepisode/te/KWVQLP1LLL/KWVQLP1LLL-eyecatch_b9bc5af117682b8869860fe3517bfd8c.jpg',
            },
          },
          partOfSeries: {
            name: 'ボキャブライダー on TV',
          },
          detailedRecentEvent: {
            startDate: '2020-06-08T05:45:00+09:00',
            publishedOn: {
              identifierGroup: {
                shortenedDisplayName: 'Eテレ',
              },
            },
          },
          url: 'https://www.nhk.jp/p/ts/QLZLXN22G2/episode/te/KWVQLP1LLL/',
        }),
      },
    },
    description: {
      Episode: {
        props: {
          episode: 'API から返却されるエピソード',
        },
      },
    },
  }),
  {
    info: true,
    notes: `
        # Episode
        [Editor.js](https://editorjs.io/) で作成したブロックに対するコンポーネントです。
      `,
  }
)
