import { ReactElement } from 'react'
import userEvent from '@testing-library/user-event'
import { render, RenderOptions } from '@testing-library/react'

import AppProvider from '@/providers/app'

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AppProvider, ...options })

// eslint-disable-next-line import/export
export * from '@testing-library/react'
export { userEvent, customRender as render }
