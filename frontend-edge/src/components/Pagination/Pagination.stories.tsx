import React from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { Pagination } from './Pagination'

export default {
  component: Pagination
} as ComponentMeta<typeof Pagination>

export const Default: ComponentStoryObj<typeof Pagination> = {
  render: (args) => <Pagination {...args} />,
  args: {
    page: 1,
    offset: 20,
    totalCount: 101,
    pageCount: 5,
    onChangePage: () => {}
  }
}
