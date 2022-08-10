import { useForm } from 'react-hook-form'
import React from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import FloatingLabelTextarea from './FloatingLabelTextarea'

type Inputs = {
  text: string
}

export default {
  component: FloatingLabelTextarea
} as ComponentMeta<typeof FloatingLabelTextarea>

export const Default: ComponentStoryObj<typeof FloatingLabelTextarea & any> = {
  render: (args) => {
    const { id, label, isRequired, registerOptions } = args

    const {
      register,
      formState: { errors }
    } = useForm<Inputs>()

    return (
      <FloatingLabelTextarea
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
