import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { NoDataFound } from './NoDataFound'

export default {
  component: NoDataFound
} as ComponentMeta<typeof NoDataFound>

export const Default: ComponentStoryObj<typeof NoDataFound> = {
  render: (args) => <NoDataFound {...args} />,
  args: {
    target: 'エピソード'
  }
}
