import React from 'react'
import { ComponentMeta } from '@storybook/react'

import Breadcrumb from './Breadcrumb'

export default {
  title: 'Components/Breadcrumb',
  component: Breadcrumb
} as ComponentMeta<typeof Breadcrumb>

const Template = () => <Breadcrumb />

export const Default = Template.bind({})
