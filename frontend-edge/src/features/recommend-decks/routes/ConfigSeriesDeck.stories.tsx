import { QueryClientProvider } from 'react-query'
import { within, userEvent, waitFor, screen } from '@storybook/testing-library'
import {
  ComponentMeta,
  StoryContext,
  ReactFramework,
  ComponentStoryObj
} from '@storybook/react'
import { expect } from '@storybook/jest'

import { handlers } from '@/test/server/handlers'
import { db, resetDb } from '@/test/server/db'
import { recommendDeckGenerator } from '@/test/data-generators'
import { queryClient } from '@/lib/react-query'

import ConfigRecommendDeck from './ConfigRecommendDeck'

export default {
  component: ConfigRecommendDeck
} as ComponentMeta<typeof ConfigRecommendDeck>

const fakeRecommendDeck = recommendDeckGenerator()

const Default: ComponentStoryObj<typeof ConfigRecommendDeck> = {
  render: () => (
    <QueryClientProvider client={queryClient}>
      <ConfigRecommendDeck />
    </QueryClientProvider>
  ),
  parameters: {
    msw: {
      handlers
    },
    reactRouter: {
      routePath: '/recommend-decks/:recommendDeckId/config',
      routeParams: { recommendDeckId: fakeRecommendDeck.id }
    }
  }
}

export const EditDeckConfig: ComponentStoryObj<typeof ConfigRecommendDeck> = {
  ...Default,
  name: '管理設定編集',
  // eslint-disable-next-line max-statements
  play: async ({ canvasElement }: StoryContext<ReactFramework, unknown>) => {
    await resetDb()

    await db.recommendDeck.create(fakeRecommendDeck)

    const canvas = within(canvasElement)

    await waitFor(
      async () => {
        await expect(canvas.getByText(/保存する/)).toBeInTheDocument()
      },
      { timeout: 5000 }
    )

    // フォームを入力する
    await userEvent.type(canvas.getByTestId('adminMemo'), 'テストメモ')
    await userEvent.click(canvas.getByText(/保存する/))

    // トースターを確認
    await waitFor(
      async () => {
        await expect(screen.getByText(/保存しました/)).toBeInTheDocument()
      },
      { timeout: 5000 }
    )

    await resetDb()
  }
}
