import React from 'react'
import { ComponentMeta } from '@storybook/react'

import { Breadcrumb } from './Breadcrumb'

export default {
  component: Breadcrumb
} as ComponentMeta<typeof Breadcrumb>

const Template = () => <Breadcrumb />

export const Default = Template.bind({})
