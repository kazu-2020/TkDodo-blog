import React from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { APIStatusSelect } from './APIStatusSelect'

export default {
  component: APIStatusSelect,
  argTypes: {
    defaultValue: {
      options: ['open', 'close', ''],
      control: { type: 'select' }
    }
  }
} as ComponentMeta<typeof APIStatusSelect>

export const Default: ComponentStoryObj<typeof APIStatusSelect> = {
  render: (args) => <APIStatusSelect {...args} />,
  args: {
    defaultValue: 'open',
    onChange: () => {}
  }
}
