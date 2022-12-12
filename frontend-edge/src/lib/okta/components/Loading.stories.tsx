import React from 'react'
import { ComponentMeta } from '@storybook/react'

import Loading from './Loading'

export default {
  component: Loading
} as ComponentMeta<typeof Loading>

const Template = () => <Loading />

export const Default = Template.bind({})
