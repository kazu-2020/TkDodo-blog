import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Pagination } from './Pagination'

export default {
  title: 'Components/Pagination',
  component: Pagination
} as ComponentMeta<typeof Pagination>

const Template: ComponentStory<typeof Pagination> = (props) => (
  <Pagination {...props} />
)

export const Default = Template.bind({})
Default.args = {
  page: 1,
  offset: 20,
  totalCount: 101,
  pageCount: 5,
  onChangePage: () => {}
}
