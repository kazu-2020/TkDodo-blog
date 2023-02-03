import { QueryClientProvider } from '@tanstack/react-query'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { Container } from '@chakra-ui/react'

import { queryClient } from '@/lib/react-query'

import { AnnouncementListItem } from './AnnouncementListItem' // eslint-disable-line import/no-cycle

export default {
  component: AnnouncementListItem
} as ComponentMeta<typeof AnnouncementListItem>

export const Default: ComponentStoryObj<typeof AnnouncementListItem> = {
  args: {
    status: 'general',
    contents: 'マニュアルを更新しました  https://example.com',
    createdAt: '2023-01-12T10:04:03+09:00'
  },
  decorators: [
    (Story) => (
        <QueryClientProvider client={queryClient}>
          <Container maxW="container.xl">
            <Story />
          </Container>
        </QueryClientProvider>
      )
  ]
}

export const Editable = {
  ...Default,
  args: {
    ...Default.args,
    isEditable: true
  }
}

export const LongText = {
  ...Editable,
  args: {
    ...Editable.args,
    contents:
      'ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。ここにお知らせが入ります。'
  }
}
