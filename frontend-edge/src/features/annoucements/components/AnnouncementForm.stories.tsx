import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import userEvent from '@testing-library/user-event'
import { within } from '@testing-library/react'

import { AnnouncementForm } from './AnnouncementForm'
import { Container } from '@chakra-ui/react'

export default {
  component: AnnouncementForm
} as ComponentMeta<typeof AnnouncementForm>

export const Default: ComponentStoryObj<typeof AnnouncementForm> = {
  args: {
    onSubmit: () => {}
  },
  render: (args) => <AnnouncementForm {...args} />,
  decorators: [
    (Story) => (
      <Container maxW="container.xl">
        <Story />
      </Container>
    )
  ]
}

export const EmptyError: ComponentStoryObj<typeof AnnouncementForm> = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('新規登録する'))
  }
}

export const Filled: ComponentStoryObj<typeof AnnouncementForm> = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(
      canvas.getByLabelText(/お知らせ内容/),
      'お知らせ https://example.com'
    )
  }
}

export const FilledSuccess: ComponentStoryObj<typeof AnnouncementForm> = {
  ...Filled,
  play: async (ctx) => {
    await Filled.play?.(ctx)
    await EmptyError.play?.(ctx)
  }
}
