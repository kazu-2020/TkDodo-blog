import { QueryClientProvider } from '@tanstack/react-query'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { Container } from '@chakra-ui/react'

import { handlers } from '@/test/server/handlers'
import { db, resetDb } from '@/test/server/db'
import { userGenerator } from '@/test/data-generators'
import { queryClient } from '@/lib/react-query'

import { UserTable } from './UserTable' // eslint-disable-line import/no-cycle

export default {
  component: UserTable
} as ComponentMeta<typeof UserTable>

export const Default: ComponentStoryObj<typeof UserTable> = {
  parameters: {
    msw: { handlers }
  },
  decorators: [
    (Story) => {
      resetDb()
      const users = db.user.getAll()
      if (users.length < 1) {
        for (let i = 1; i <= 20; i += 1) {
          db.user.create(userGenerator())
        }
      }

      return (
        <QueryClientProvider client={queryClient}>
          <Container maxW="container.xl">
            <Story />
          </Container>
        </QueryClientProvider>
      )
    }
  ]
}
