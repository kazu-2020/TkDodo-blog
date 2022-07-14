import { useForm } from 'react-hook-form'
import React from 'react'
import { ComponentMeta } from '@storybook/react'

import FloatingLabelInputControl from './FloatingLabelInputControl'

export default {
  title: 'Components/Form/FloatingLabelInput',
  component: FloatingLabelInputControl,
  parameters: {
    controls: { expanded: true }
  }
} as ComponentMeta<typeof FloatingLabelInputControl>

type Inputs = {
  text: string
}

const Template = () => {
  const {
    register,
    formState: { errors }
  } = useForm<Inputs>()

  return (
    <FloatingLabelInputControl
      id="text"
      label="テキスト - Text"
      isInvalid={errors?.text}
      register={register('text', {
        required: 'テキストを入力してください'
      })}
    />
  )
}

export const Default = Template.bind({})
