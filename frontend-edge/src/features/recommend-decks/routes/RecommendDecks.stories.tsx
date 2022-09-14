import { QueryClientProvider } from 'react-query'
import { userEvent, waitFor, within } from '@storybook/testing-library'
import {
  ComponentMeta,
  ComponentStoryObj,
  ReactFramework,
  StoryContext
} from '@storybook/react'
import { expect } from '@storybook/jest'

import { handlers } from '@/test/server/handlers'
import { db } from '@/test/server/db'
import { recommendDeckGenerator } from '@/test/data-generators'
import { queryClient } from '@/lib/react-query'

import RecommendDecks from './RecommendDecks'

export default {
  component: RecommendDecks
} as ComponentMeta<typeof RecommendDecks>

const recommendDecks = db.recommendDeck.getAll()
if (recommendDecks.length < 1) {
  ;[...Array(20)].map(async () =>
    db.recommendDeck.create(recommendDeckGenerator())
  )
}

export const Default = {
  render: () => (
    <QueryClientProvider client={queryClient}>
      <RecommendDecks />
    </QueryClientProvider>
  ),
  parameters: {
    msw: {
      handlers
    },
    reactRouter: {
      routePath: '/recommend-decks'
    }
  }
}

export const ShowRecommendDeckDrawer: ComponentStoryObj<typeof RecommendDecks> =
  {
    ...Default,
    name: 'ドロワーの表示',
    // eslint-disable-next-line max-statements
    play: async ({ canvasElement }: StoryContext<ReactFramework, unknown>) => {
      const canvas = within(canvasElement)

      // 検索結果が表示されるまで待機
      await waitFor(
        async () => {
          await expect(
            canvas.getByTestId('recommend-list-items')
          ).toBeInTheDocument()
        },
        { timeout: 10000 }
      )

      const searchResult = within(canvas.getByTestId('recommend-list-items'))
      await userEvent.click(searchResult.getAllByRole('listitem')[0])
      await waitFor(
        async () => {
          await expect(canvas.queryByRole('dialog')).toBeInTheDocument()
        },
        { timeout: 10000 }
      )

      // ドロワーの表示
      await waitFor(
        async () => {
          await expect(
            canvas.getByTestId('recommend-deck-drawer')
          ).toBeInTheDocument()
        },
        { timeout: 10000 }
      )
    }
  }

export const DeleteRecommendDeck: ComponentStoryObj<typeof RecommendDecks> = {
  ...Default,
  name: 'デッキの削除',
  // eslint-disable-next-line max-statements
  play: async ({ canvasElement }: StoryContext<ReactFramework, unknown>) => {
    const canvas = within(canvasElement)

    // 検索結果が表示されるまで待機
    await waitFor(
      async () => {
        await expect(
          canvas.getByTestId('recommend-list-items')
        ).toBeInTheDocument()
      },
      { timeout: 10000 }
    )

    const searchResult = within(canvas.getByTestId('recommend-list-items'))

    // ドロワーの表示
    await userEvent.click(searchResult.getAllByRole('listitem')[0])
    await waitFor(
      async () => {
        await expect(
          canvas.getByTestId('recommend-deck-drawer')
        ).toBeInTheDocument()
      },
      { timeout: 10000 }
    )
    await expect(canvas.getByTestId('recommend-deck-drawer'))
  }
}

// export const GotoEditRecommendDeck: ComponentStoryObj<typeof RecommendDecks> = {
//   ...Default,
//   name: 'デッキの編集へ遷移',
//   // eslint-disable-next-line max-statements
//   play: async ({ canvasElement }: StoryContext<ReactFramework, unknown>) => {}
// }
//
// export const GotoConfigRecommendDeck: ComponentStoryObj<typeof RecommendDecks> =
//   {
//     ...Default,
//     name: 'デッキの管理設定へ遷移',
//     // eslint-disable-next-line max-statements
//     play: async ({ canvasElement }: StoryContext<ReactFramework, unknown>) => {}
//   }
