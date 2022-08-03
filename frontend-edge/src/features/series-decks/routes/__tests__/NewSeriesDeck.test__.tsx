import { render, screen, within } from '@/test/test-utils'
import { db } from '@/test/server/db'

import NewSeriesDeck from '../NewSeriesDeck'

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // eslint-disable-next-line no-console
  vi.mocked(console.error).mockRestore()
})

describe.skip('シリーズデッキの新規作成', async () => {
  it('成功すること', async () => {
    const { user } = render(<NewSeriesDeck />, { route: '/series-decks/new' })

    // フォームを入力して送信する
    const form = screen.getByTestId('seriesDeckForm')

    await user.type(within(form).getByTestId('name'), 'テストシリーズデッキ')
    await user.type(within(form).getByTestId('interfix'), 'test')
    await user.type(within(form).getByTestId('description'), 'デッキの説明')
    await user.click(within(form).getByText('APIへ公開する'))

    const submitButton = within(form).getByRole('button', {
      name: /Submit/i
    })

    await user.click(submitButton)

    expect(db.seriesDeck.getAll().length).toEqual(1)

    // FIXME: toastや一覧への遷移の確認
    // const toast = screen.getByRole('alert')
    // expect(toast).toBeInTheDocument()
    // expect(await screen.findByText(/シリーズデッキ一覧/i)).toBeInTheDocument()
  })
})
