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
import { seriesDeckGenerator } from '@/test/data-generators'
import { queryClient } from '@/lib/react-query'

import ConfigSeriesDeck from './ConfigSeriesDeck'

export default {
  component: ConfigSeriesDeck
} as ComponentMeta<typeof ConfigSeriesDeck>

const fakeSeriesDeck = seriesDeckGenerator()

const Default: ComponentStoryObj<typeof ConfigSeriesDeck> = {
  render: () => (
    <QueryClientProvider client={queryClient}>
      <ConfigSeriesDeck />
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
  }
}

export const EditDeckConfig: ComponentStoryObj<typeof ConfigSeriesDeck> = {
  ...Default,
  name: '管理設定編集',
  // eslint-disable-next-line max-statements
  play: async ({ canvasElement }: StoryContext<ReactFramework, unknown>) => {
    await queryClient.clear()
    await resetDb()

    await db.seriesDeck.create(fakeSeriesDeck)

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

    await queryClient.clear()
    await resetDb()
  }
}
