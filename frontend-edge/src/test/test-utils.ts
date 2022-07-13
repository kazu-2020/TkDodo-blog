import { ReactElement } from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import AppProvider from '@/providers/app'

const customRender = (
  ui: ReactElement,
  { route = '/', ...renderOptions }: Record<string, any> = {}
) => {
  window.history.pushState({}, 'Test page', route)

  return {
    ...render(ui, {
      wrapper: AppProvider,
      ...renderOptions
    })
  }
}

// eslint-disable-next-line import/export
export * from '@testing-library/react'
export { userEvent, customRender as render }
