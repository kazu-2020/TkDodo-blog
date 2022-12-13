import { QueryClientProvider } from '@tanstack/react-query'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { Box } from '@chakra-ui/react'

import { handlers } from '@/test/server/handlers'
import { db, resetDb } from '@/test/server/db'
import { seriesDeckGenerator } from '@/test/data-generators'
import { queryClient } from '@/lib/react-query'

import SeriesDeck from './SeriesDeck'

export default {
  component: SeriesDeck
} as ComponentMeta<typeof SeriesDeck>

const fakeSeriesDeck = seriesDeckGenerator()

export const Default: ComponentStoryObj<typeof SeriesDeck> = {
  render: () => (
    <QueryClientProvider client={queryClient}>
      {/* ヘッダー分の高さを設定してStickyなArrowStepを調整 */}
      <Box h="60px" bgColor="#f0f0f0" zIndex="888" />
      <SeriesDeck />
    </QueryClientProvider>
  ),
  parameters: {
    msw: {
      handlers
    },
    reactRouter: {
      routePath: '/series-decks/:seriesDeckId',
      routeParams: { seriesDeckId: fakeSeriesDeck.id }
    }
  },
  play: async () => {
    // NOTE: NewSeriesDeckと被るのでsmoke testのみ
    await resetDb()
    await db.seriesDeck.create(fakeSeriesDeck)
  }
}
