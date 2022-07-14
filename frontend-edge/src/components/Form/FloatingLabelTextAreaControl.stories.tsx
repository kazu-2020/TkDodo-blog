import { useForm } from 'react-hook-form'
import React from 'react'
import { ComponentMeta } from '@storybook/react'

import FloatingLabelTextAreaControl from './FloatingLabelTextAreaControl'

export default {
  title: 'Components/Form/FloatingLabelTextAreaControl',
  component: FloatingLabelTextAreaControl,
  parameters: {
    controls: { expanded: true }
  }
} as ComponentMeta<typeof FloatingLabelTextAreaControl>

type Inputs = {
  text: string
}

const Template = () => {
  const {
    register,
    formState: { errors }
  } = useForm<Inputs>()

  return (
    <FloatingLabelTextAreaControl
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
