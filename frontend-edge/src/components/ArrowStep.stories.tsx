import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ArrowStepContextProvider } from '@/features/misc/components/arrowstep/ArrowStepContext'

import ArrowStep from './ArrowStep'

export default {
  title: 'Components/ArrowStep',
  component: ArrowStep
} as ComponentMeta<typeof ArrowStep>

const Template: ComponentStory<typeof ArrowStep> = (props) => {
  return (
    <ArrowStepContextProvider>
      <ArrowStep {...props} />
    </ArrowStepContextProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  items: [
    { title: 'リスト (NItemList)', isSuccess: true, hasError: false },
    { title: '記事 (NArticle)', isSuccess: false, hasError: true },
    { title: '基本情報(NSeries)', isSuccess: false, hasError: false }
  ]
}
