import React from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { ListScreenSkeleton } from './ListScreenSkeleton'

export default {
  component: ListScreenSkeleton
} as ComponentMeta<typeof ListScreenSkeleton>

export const Default: ComponentStoryObj<typeof ListScreenSkeleton> = {
  render: (args) => <ListScreenSkeleton {...args} />,
  args: {
    size: 20
  }
}
