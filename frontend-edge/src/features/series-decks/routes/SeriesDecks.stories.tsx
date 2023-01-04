import { QueryClientProvider } from '@tanstack/react-query'
import { ComponentMeta } from '@storybook/react'

import { handlers } from '@/test/server/handlers'
import { db } from '@/test/server/db'
import { seriesDeckGenerator } from '@/test/data-generators'
import { queryClient } from '@/lib/react-query'

import SeriesDecks from './SeriesDecks'

export default {
  component: SeriesDecks
} as ComponentMeta<typeof SeriesDecks>

const seriesDecks = db.seriesDeck.getAll()
if (seriesDecks.length < 1) {
  ;[...Array(20)].map(async () => db.seriesDeck.create(seriesDeckGenerator()))
}

export const Default = {
  render: () => (
    <QueryClientProvider client={queryClient}>
      <SeriesDecks />
    </QueryClientProvider>
  ),
  parameters: {
    msw: {
      handlers
    }
  }
}

// TODO: テストを書く
// export const DeleteSeriesDeck = {
//   ...Default,
//   name: 'デッキの削除'
// }
