import React from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { CropperImageModal } from './CropperImageModal'

export default {
  component: CropperImageModal
} as ComponentMeta<typeof CropperImageModal>

export const Default: ComponentStoryObj<typeof CropperImageModal> = {
  render: (args) => <CropperImageModal {...args} />,
  args: {
    imageType: 'logo',
    open: true,
    onClose: () => {}
  }
}
