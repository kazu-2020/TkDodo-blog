import { useForm } from 'react-hook-form'
import React from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import FloatingLabelInput from './FloatingLabelInput'

type Inputs = {
  text: string
}

export default {
  component: FloatingLabelInput
} as ComponentMeta<typeof FloatingLabelInput>

export const Default: ComponentStoryObj<typeof FloatingLabelInput & any> = {
  render: (args) => {
    const { id, label, isRequired, registerOptions } = args

    const {
      register,
      formState: { errors }
    } = useForm<Inputs>()

    return (
      <FloatingLabelInput
        id={id}
        label={label}
        error={errors?.text}
        register={register(id, registerOptions)}
        isRequired={isRequired}
      />
    )
  },
  args: {
    id: 'text',
    label: 'テキスト - Text',
    isRequired: true,
    registerOptions: {
      required: 'テキストを入力してください'
    }
  }
}
