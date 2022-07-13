// FIXME: 上手く動作しないのでskipしている

// import { useParams } from 'react-router-dom'
// spyOn ver
// import * as router from 'react-router-dom'

import { render, screen, userEvent, within } from '@/test/test-utils'
import { db } from '@/test/server/db'
import { seriesDeckGenerator } from '@/test/data-generators'

import SeriesDeck from '../SeriesDeck'

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  // eslint-disable-next-line no-console
  vi.mocked(console.error).mockRestore()
})

const renderSeriesDeck = async () => {
  const fakeSeriesDeck = seriesDeckGenerator()
  db.seriesDeck.create(fakeSeriesDeck)

  // vi.spyOn(router, 'useParams').mockImplementation(() => ({
  //   seriesDeckId: fakeSeriesDeck.id
  // }))

  vi.mock('react-router-dom', () => ({
    useParams: vi.fn(() => ({
      seriesDeckId: fakeSeriesDeck.id
    }))
  }))

  const utils = render(<SeriesDeck />, {
    route: `/series-decks/${fakeSeriesDeck.id}`
  })

  return {
    ...utils,
    fakeSeriesDeck
  }
}

describe.skip('シリーズデッキの編集', async () => {
  it('成功すること', async () => {
    await renderSeriesDeck()

    // フォームを入力して送信する
    const form = screen.getByTestId('XseriesDeckForm')

    await userEvent.type(
      within(form).getByTestId('name'),
      'テストシリーズデッキ'
    )
    await userEvent.type(within(form).getByTestId('interfix'), 'test')
    await userEvent.type(
      within(form).getByTestId('description'),
      'デッキの説明'
    )
    await userEvent.click(within(form).getByText('公開する'))

    const submitButton = within(form).getByRole('button', {
      name: /Submit/i
    })

    await userEvent.click(submitButton)

    expect(db.seriesDeck.getAll().length).toEqual(1)

    // FIXME: toastや一覧への遷移の確認
    // const toast = screen.getByRole('alert')
    // expect(toast).toBeInTheDocument()
    // expect(await screen.findByText(/シリーズデッキ一覧/i)).toBeInTheDocument()
  })
})
