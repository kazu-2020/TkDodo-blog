import { BrowserRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'

// import userEvent from '@testing-library/user-event'
import { Header } from '../Header'

describe('Header component', () => {
  // https://vitest.dev/guide/snapshot.html#inline-snapshots
  test('should render correctly', () => {
    const {
      container: { firstChild }
    } = render(<Header />, { wrapper: BrowserRouter })
    expect(firstChild).toMatchSnapshot()
  })

  test('find text', () => {
    render(<Header />, { wrapper: BrowserRouter })
    expect(screen.getByText(/プレイリスト/i)).toBeInTheDocument()
  })

  // test('click logo', async () => {
  //   render(<Header />, { wrapper: BrowserRouter })
  //   await userEvent.click(screen.getByText('プレイリスト'))
  //   expect(await screen.findByText(/プレイリスト/i)).not.toBeEmptyDOMElement()
  // })
})
