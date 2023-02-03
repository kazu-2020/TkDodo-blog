import React from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { ArrowStepItem } from '@/components/ArrowStep/ArrowStepItem'

export default {
  component: ArrowStepItem
} as ComponentMeta<typeof ArrowStepItem>

export const Default: ComponentStoryObj<typeof ArrowStepItem> = {
  render: (args) => <ArrowStepItem {...args} />,
  args: {
    title: 'ここにラベルがはいります',
    isCurrent: false,
    hasError: false
  }
}
