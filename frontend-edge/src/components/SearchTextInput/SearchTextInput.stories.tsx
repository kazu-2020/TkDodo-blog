import React from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { SearchTextInput } from './SearchTextInput'

export default {
  component: SearchTextInput
} as ComponentMeta<typeof SearchTextInput>

export const Default: ComponentStoryObj<typeof SearchTextInput> = {
  render: (args) => <SearchTextInput {...args} />,
  args: {
    placeholder: 'ここにプレースホルダーが入ります',
    onAction: () => {}
  }
}
