import {
  render,
  screen,
  userEvent,
  within,
  waitFor,
  waitForElementToBeRemoved
} from '@/test/test-utils'
import { db } from '@/test/server/db'
import { seriesDeckGenerator } from '@/test/data-generators'

import SeriesDecks from '../SeriesDecks'

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // eslint-disable-next-line no-console
  vi.mocked(console.error).mockRestore()
})

describe('シリーズ一覧', async () => {
  beforeEach(async () => {
    ;[...Array(20)].map(async () => db.seriesDeck.create(seriesDeckGenerator()))
  })

  it('シリーズデッキが削除できること', async () => {
    await render(<SeriesDecks />)

    expect(await screen.findByText(/シリーズデッキ一覧/i)).toBeInTheDocument()

    // スケルトンスクリーンが消えるまで待機
    const skeletons = screen.getAllByTestId('skeleton')
    await waitForElementToBeRemoved(skeletons)

    // 一覧からデッキをクリック
    const listItemSize = screen.getAllByRole('listitem').length
    userEvent.click(screen.getAllByRole('listitem')[0])

    // ドロワーの削除ボタンをクリック
    const drawer = await screen.findByRole('dialog')
    userEvent.click(within(drawer).getByRole('button', { name: /削除する/i }))

    // アラートダイアログの削除ボタンをクリック
    const alertDialog = await screen.findByRole('alertdialog')
    userEvent.click(
      within(alertDialog).getByRole('button', { name: /削除する/i })
    )

    await waitFor(() => expect(drawer).not.toBeInTheDocument())
    await screen.findAllByRole('listitem')

    // 一覧から削除されたものが消えていることを確認
    expect(screen.getAllByRole('listitem').length).toBe(listItemSize - 1)
  })
})
