import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { TextCopyBadge } from './TextCopyBadge'

export default {
  title: 'Components/TextCopyBadge',
  component: TextCopyBadge
} as ComponentMeta<typeof TextCopyBadge>

const Template: ComponentStory<typeof TextCopyBadge> = (props) => (
  <TextCopyBadge {...props} />
)

export const Default = Template.bind({})
Default.args = {
  prefix: 'Uid',
  text: 'XXXX-XXXX-XXXX-XXXX-XXXX-XXXX',
  onCopy: () => {}
}
