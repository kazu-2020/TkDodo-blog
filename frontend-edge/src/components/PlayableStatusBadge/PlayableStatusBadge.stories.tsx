import React from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { PlayableStatusBadge } from './PlayableStatusBadge'

export default {
  component: PlayableStatusBadge
} as ComponentMeta<typeof PlayableStatusBadge>

export const Default: ComponentStoryObj<typeof PlayableStatusBadge> = {
  render: (args) => <PlayableStatusBadge {...args} />,
  args: {
    isPlayable: true
  }
}
