import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ListScreenSkeleton } from './ListScreenSkeleton'

export default {
  title: 'Components/ListScreenSkeleton',
  component: ListScreenSkeleton
} as ComponentMeta<typeof ListScreenSkeleton>

const Template: ComponentStory<typeof ListScreenSkeleton> = (props) => (
  <ListScreenSkeleton {...props} />
)

export const Default = Template.bind({})
Default.args = {
  size: 20
}
