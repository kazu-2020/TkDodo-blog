import React from 'react'
import { ComponentMeta } from '@storybook/react'

import { ListScreenSkeleton } from './ListScreenSkeleton'

export default {
  title: 'Components/ListScreenSkeleton',
  component: ListScreenSkeleton
} as ComponentMeta<typeof ListScreenSkeleton>

const Template = () => <ListScreenSkeleton />

export const Default = Template.bind({})
