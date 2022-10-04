import React from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { Video } from '@/components/Video/Video'

export default {
  component: Video
} as ComponentMeta<typeof Video>

export const Default: ComponentStoryObj<typeof Video> = {
  render: (args) => <Video {...args} />,
  args: {
    src: ''
  }
}
