import React from 'react'
import { ComponentStory } from '@storybook/react'

import { ArrowStepItem } from '@/components/ArrowStep/ArrowStepItem'

export default {
  title: 'Components/ArrowStep/ArrowStepItem',
  component: ArrowStepItem
}

const Template: ComponentStory<typeof ArrowStepItem> = (props) => (
  <ArrowStepItem {...props} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'ここにラベルがはいります',
  isCurrent: false,
  isSuccess: false,
  hasError: false
}
