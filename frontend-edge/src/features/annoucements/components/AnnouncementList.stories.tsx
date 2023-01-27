import { QueryClientProvider } from '@tanstack/react-query'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { Container } from '@chakra-ui/react'

import { handlers } from '@/test/server/handlers'
import { db, resetDb } from '@/test/server/db'
import { announcementGenerator } from '@/test/data-generators'
import { queryClient } from '@/lib/react-query'

import { AnnouncementList } from './AnnouncementList' // eslint-disable-line import/no-cycle

export default {
  component: AnnouncementList
} as ComponentMeta<typeof AnnouncementList>

export const Default: ComponentStoryObj<typeof AnnouncementList> = {
  parameters: {
    msw: { handlers }
  },
  decorators: [
    (Story) => {
      resetDb()
      const annoucements = db.playlist.getAll()
      if (annoucements.length < 1) {
        for (let i = 1; i <= 20; i += 1) {
          db.announcement.create(announcementGenerator())
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

export const Editable = {
  ...Default,
  args: {
    ...Default.args,
    isEditable: true
  }
}

export const ShowMore = {
  ...Default,
  args: {
    ...Default.args,
    isSawMore: true
  }
}

export const WithPagination = {
  ...Editable,
  args: {
    ...Editable.args,
    hasPagination: true
  }
}
