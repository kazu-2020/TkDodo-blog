import React from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { TextCopyBadge } from './TextCopyBadge'

export default {
  component: TextCopyBadge
} as ComponentMeta<typeof TextCopyBadge>

export const Default: ComponentStoryObj<typeof TextCopyBadge> = {
  render: (args) => <TextCopyBadge {...args} />,
  args: {
    prefix: 'Uid',
    text: 'XXXX-XXXX-XXXX-XXXX-XXXX-XXXX',
    onCopy: () => {}
  }
}
