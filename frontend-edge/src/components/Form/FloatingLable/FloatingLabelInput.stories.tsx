import { useForm } from 'react-hook-form'
import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import FloatingLabelInput from './FloatingLabelInput'

export default {
  component: FloatingLabelInput
} as ComponentMeta<typeof FloatingLabelInput>

type Inputs = {
  text: string
}

const Template: ComponentStory<typeof FloatingLabelInput & any> = (args) => {
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
}

export const Default = Template.bind({})
Default.args = {
  id: 'text',
  label: 'テキスト - Text',
  isRequired: true,
  registerOptions: {
    required: 'テキストを入力してください'
  }
}
