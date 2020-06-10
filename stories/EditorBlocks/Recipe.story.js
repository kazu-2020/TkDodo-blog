import { storiesOf } from '@storybook/vue'
import { object } from '@storybook/addon-knobs/vue'
import Recipe from '@/components/EditorBlocks/Recipe.vue'

storiesOf('Components/EditorBlocks', module).add(
  'Recipe',
  () => ({
    components: { Recipe },
    template: `<recipe :recipe-data="recipeData" :series-data="seriesData" />`,
    props: {
      recipeData: {
        type: Object,
        default: object('recipe-data', {
          name: '新ごぼうのフレッシュきんぴら',
          description:
            '上品な香りとシャキシャキとした食感が特徴の新ごぼう。 サッと炒め、味つけも控えめにすることで、サラダのようなみずみずしさに。',
          image: [
            'https://www.kyounoryouri.jp/upfile/new_xl_1587082779_604.jpg',
          ],
          cookTime: 'PT15M',
        }),
      },
      seriesData: {
        type: Object,
        default: object('series-data', {
          name: '今日の料理',
          episodes: [
            {
              name: '「新ごぼうで和おかず 新ごぼうのフレッシュきんぴら」',
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
      Recipe: {
        props: {
          recipeData: 'API から返却されるレシピデータ',
          seriesData: 'API から返却されるレシピに紐づくシリーズデータ',
        },
      },
    },
  }),
  {
    info: true,
    notes: `
        # Recipe
        [Editor.js](https://editorjs.io/) で作成したブロックに対するコンポーネントです。
      `,
  }
)
