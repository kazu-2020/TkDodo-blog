import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import SearchTextInput from './SearchTextInput'

export default {
  title: 'Components/SearchTextInput',
  component: SearchTextInput
} as ComponentMeta<typeof SearchTextInput>

const Template: ComponentStory<typeof SearchTextInput> = (props) => (
  <SearchTextInput {...props} />
)

export const Default = Template.bind({})
Default.args = {
  placeholder: 'ここにプレースホルダーが入ります',
  onAction: () => {}
}
