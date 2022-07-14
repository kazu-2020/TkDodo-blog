import { useForm } from 'react-hook-form'
import React from 'react'
import { ComponentMeta } from '@storybook/react'

import FloatingLabelInput from './FloatingLabelInput'

export default {
  title: 'Components/Form/FloatingLabelInput',
  component: FloatingLabelInput,
  parameters: {
    controls: { expanded: true }
  }
} as ComponentMeta<typeof FloatingLabelInput>

type Inputs = {
  text: string
}

const Template = () => {
  const {
    register,
    formState: { errors }
  } = useForm<Inputs>()

  return (
    <FloatingLabelInput
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
