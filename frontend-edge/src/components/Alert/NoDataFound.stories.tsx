import React from 'react'
import { ComponentMeta } from '@storybook/react'

import { NoDataFound } from './NoDataFound'

export default {
  title: 'Components/Alert/NoDataFound',
  component: NoDataFound
} as ComponentMeta<typeof NoDataFound>

const Template = () => <NoDataFound />

export const Default = Template.bind({})
