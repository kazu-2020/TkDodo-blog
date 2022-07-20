import React from 'react'
import { ComponentStory } from '@storybook/react'

import ArrowStepContent from '@/components/ArrowStepContent'

export default {
  title: 'Components/ArrowStep/ArrowStepContent',
  component: ArrowStepContent
}

const Template: ComponentStory<typeof ArrowStepContent> = (props) => (
  <ArrowStepContent {...props} />
)

export const Default = Template.bind({})
Default.args = {
  index: 0,
  children: <h2>test</h2>
}
