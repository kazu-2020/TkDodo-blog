import { QueryClientProvider } from '@tanstack/react-query'
import { within, userEvent, waitFor, screen } from '@storybook/testing-library'
import {
  ComponentMeta,
  StoryContext,
  ReactFramework,
  ComponentStoryObj
} from '@storybook/react'
import { expect } from '@storybook/jest'
import { Box } from '@chakra-ui/react'

import { handlers } from '@/test/server/handlers'
import { queryClient } from '@/lib/react-query'

import NewSeriesDeck from './NewSeriesDeck'

export default {
  component: NewSeriesDeck
} as ComponentMeta<typeof NewSeriesDeck>

export const Default: ComponentStoryObj<typeof NewSeriesDeck> = {
  render: () => (
    <QueryClientProvider client={queryClient}>
      {/* ヘッダー分の高さを設定してStickyなArrowStepを調整 */}
      <Box h="60px" bgColor="#f0f0f0" zIndex="888" />
      <NewSeriesDeck />
    </QueryClientProvider>
  ),
  parameters: {
    msw: {
      handlers
    }
  }
}

export const EditSeriesPlaylist: ComponentStoryObj<typeof NewSeriesDeck> = {
  ...Default,
  name: 'シリーズプレイリスト編成',
  // eslint-disable-next-line max-statements
  play: async ({ canvasElement }: StoryContext<ReactFramework, unknown>) => {
    const canvas = within(canvasElement)
    // シリーズ検索
    await userEvent.type(
      canvas.getByTestId('search-text-input'),
      'ダミー{enter}'
    )

    // 検索結果が表示されるまで待機
    await waitFor(
      async () => {
        await expect(
          canvas.getByTestId('series-playlist-search-results')
        ).toBeInTheDocument()
      },
      { timeout: 10000 }
    )
    const searchResult = within(
      canvas.getByTestId('series-playlist-search-results')
    )
    // ページング
    await userEvent.click(
      searchResult.getAllByRole('button', { name: '次の10件を表示' })[0]
    )

    // プラスボタンで編成
    await userEvent.click(
      searchResult.getAllByRole('button', { name: '追加' })[0]
    )
    await userEvent.click(
      searchResult.getAllByRole('button', { name: '追加' })[1]
    )
    await userEvent.click(
      searchResult.getAllByRole('button', { name: '追加' })[2]
    )

    // マイナスボタンで編成解除
    const editSeriesPlaylist = within(
      canvas.getByTestId('edit-series-playlist')
    )
    await userEvent.click(
      editSeriesPlaylist.getAllByRole('button', { name: '削除' })[0]
    )
    await userEvent.click(
      editSeriesPlaylist.getAllByRole('button', { name: '削除' })[1]
    )
  }
}

export const EditDeck: ComponentStoryObj<typeof NewSeriesDeck> = {
  ...Default,
  name: 'メタ情報編集',
  // eslint-disable-next-line max-statements
  play: async ({ canvasElement }: StoryContext<ReactFramework, unknown>) => {
    const canvas = within(canvasElement)
    // 基本情報タブを開く
    await userEvent.click(canvas.getByText(/基本情報/))

    // フォームを入力する
    await userEvent.type(canvas.getByTestId('name'), 'テストシリーズデッキ')
    await userEvent.type(canvas.getByTestId('interfix'), 'test')
    await userEvent.type(canvas.getByTestId('description'), 'デッキの説明')
    await userEvent.click(canvas.getByText('APIへ公開する'))
  }
}

// リスト(Playlist) タブのステータスを取得する
const getListTabStatus = async (): Promise<'error' | 'success' | 'none'> => {
  const listTab = within(
    screen.getByRole('tab', { name: /リスト\(Playlist\)/ })
  )
  const error = await listTab.queryByRole('status', { name: 'error' })
  if (error) return 'error'

  const success = await listTab.queryByRole('status', { name: 'success' })
  if (success) return 'success'

  return 'none'
}

// 基本情報(Deck) タブのステータスを取得する
const getDeckTabStatus = async (): Promise<'error' | 'success' | 'none'> => {
  const deckTab = within(screen.getByRole('tab', { name: /基本情報\(Deck\)/ }))
  const error = await deckTab.queryByRole('status', { name: 'error' })
  if (error) return 'error'

  const success = await deckTab.queryByRole('status', { name: 'success' })
  if (success) return 'success'

  return 'none'
}

export const SaveDeck: ComponentStoryObj<typeof NewSeriesDeck> = {
  ...Default,
  name: 'デッキの保存',
  // eslint-disable-next-line max-statements
  play: async (ctx: StoryContext<ReactFramework, unknown>) => {
    // タブの状態の確認（Deckがerror）
    await expect(await getDeckTabStatus()).toEqual('error')

    // 保存ボタンが押せないことを確認
    await expect(screen.getByText(/保存する/).closest('button')).toBeDisabled()

    await EditSeriesPlaylist.play?.(ctx)

    // タブの状態の確認（Listがsuccess, Deckがerror）
    await expect(await getListTabStatus()).toEqual('success')
    await expect(await getDeckTabStatus()).toEqual('error')

    await EditDeck.play?.(ctx)

    // 保存ボタンが押せるようになるまで待機
    await waitFor(() => {
      expect(screen.getByText(/保存する/).closest('button')).not.toBeDisabled()
    })

    // タブの状態の確認（Listがsuccess, Deckがsuccess）
    await expect(await getListTabStatus()).toEqual('success')
    await expect(await getDeckTabStatus()).toEqual('success')

    await userEvent.click(screen.getByText(/保存する/))

    // トースターを確認
    await waitFor(
      async () => {
        await expect(screen.getByText(/作成しました/)).toBeInTheDocument()
      },
      { timeout: 5000 }
    )
  }
}
