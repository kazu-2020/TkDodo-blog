import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { APIStatusSelect } from './APIStatusSelect'

export default {
  title: 'Components/APIStatusSelect',
  component: APIStatusSelect,
  argTypes: {
    defaultValue: {
      options: ['open', 'close', ''],
      control: { type: 'select' }
    }
  }
} as ComponentMeta<typeof APIStatusSelect>

const Template: ComponentStory<typeof APIStatusSelect> = (props) => (
  <APIStatusSelect {...props} />
)

export const Default = Template.bind({})
Default.args = {
  defaultValue: 'open',
  onChange: () => {}
}
