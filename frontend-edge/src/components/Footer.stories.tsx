import React from 'react'
import { ComponentMeta } from '@storybook/react'

import Footer from './Footer'

export default {
  title: 'Components/Footer',
  component: Footer
} as ComponentMeta<typeof Footer>

const Template = () => <Footer />

export const Default = Template.bind({})
