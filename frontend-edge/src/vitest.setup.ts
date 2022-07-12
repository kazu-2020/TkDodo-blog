/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom'
import 'jest-extended'
import { server } from '@/test/server/server'
import { queryClient } from '@/lib/react-query'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

// general cleanup
afterEach(async () => {
  queryClient.clear()
})
