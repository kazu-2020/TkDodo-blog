import { useForm } from 'react-hook-form'
import React from 'react'
import { ComponentMeta } from '@storybook/react'

import FloatingLabelTextarea from './FloatingLabelTextarea'

export default {
  title: 'Components/Form/FloatingLabelTextarea',
  component: FloatingLabelTextarea,
  parameters: {
    controls: { expanded: true }
  }
} as ComponentMeta<typeof FloatingLabelTextarea>

type Inputs = {
  text: string
}

const Template = () => {
  const {
    register,
    formState: { errors }
  } = useForm<Inputs>()

  return (
    <FloatingLabelTextarea
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
