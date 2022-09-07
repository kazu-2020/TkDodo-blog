import React from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { PlaylistImageFormItemImage } from './PlaylistImageFormItemImage'

export default {
  component: PlaylistImageFormItemImage
} as ComponentMeta<typeof PlaylistImageFormItemImage>

export const Default: ComponentStoryObj<typeof PlaylistImageFormItemImage> = {
  render: (args) => <PlaylistImageFormItemImage {...args} />,
  args: {
    src: 'https://picsum.photos/200',
    fallbackSrc: 'https://picsum.photos/200',
    onEdit: () => {},
    onRemove: () => {},
    htmlHeight: '200px',
    htmlWidth: '200px'
  }
}
