import { QueryClientProvider } from 'react-query'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { Box } from '@chakra-ui/react'

import { handlers } from '@/test/server/handlers'
import { db, resetDb } from '@/test/server/db'
import { recommendDeckGenerator } from '@/test/data-generators'
import { queryClient } from '@/lib/react-query'

import RecommendDeck from './RecommendDeck'

export default {
  component: RecommendDeck
} as ComponentMeta<typeof RecommendDeck>

const fakeRecommendDeck = recommendDeckGenerator()

export const Default: ComponentStoryObj<typeof RecommendDeck> = {
  render: () => (
    <QueryClientProvider client={queryClient}>
      {/* ヘッダー分の高さを設定してStickyなArrowStepを調整 */}
      <Box h="60px" bgColor="#f0f0f0" zIndex="888" />
      <RecommendDeck />
    </QueryClientProvider>
  ),
  parameters: {
    msw: {
      handlers
    },
    reactRouter: {
      routePath: '/recommend-decks/:recommendDeckId',
      routeParams: { recommendDeckId: fakeRecommendDeck.id }
    }
  },
  play: async () => {
    // NOTE: NewRecommendDeckと被るのでsmoke testのみ
    await resetDb()
    await db.recommendDeck.update({
      where: {
        id: {
          equals: fakeRecommendDeck.id
        }
      },
      data: {
        name: `${fakeRecommendDeck.id} update`
      }
    })
  }
}
