/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom'
import 'jest-extended'
import { setGlobalConfig } from '@storybook/testing-react'

import { server } from '@/test/server/server'
import { resetDb } from '@/test/server/db'
import { queryClient } from '@/lib/react-query'

import * as globalStorybookConfig from '../.storybook/preview'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

// general cleanup
afterEach(async () => {
  queryClient.clear()
  resetDb()
})

setGlobalConfig(globalStorybookConfig)
