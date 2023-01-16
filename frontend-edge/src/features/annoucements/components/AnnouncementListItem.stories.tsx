import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { AnnouncementListItem } from './AnnouncementListItem'
import { Box } from '@chakra-ui/react'

export default {
  component: AnnouncementListItem
} as ComponentMeta<typeof AnnouncementListItem>

export const Default: ComponentStoryObj<typeof AnnouncementListItem> = {
  render: (args) => (
    <Box w="1200px">
      <AnnouncementListItem {...args} />
    </Box>
  ),
  args: {
    status: 'general',
    contents: 'マニュアルを更新しました  https://example.com',
    createdAt: '2023-01-12T10:04:03+09:00'
  }
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
