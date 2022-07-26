import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import React, { FC } from 'react'
import { StyleProps } from '@chakra-ui/styled-system/dist/declarations/src/system.types'
import { Input } from '@chakra-ui/react'

import FloatingLabelFormControl from './FloatingLabelFormControl'

type Props = {
  register: UseFormRegisterReturn
  id: string
  label: string
  error: FieldError | undefined
  isRequired?: boolean
}

const FloatingLabelInput: FC<Props & StyleProps> = ({
  register,
  id,
  label,
  error,
  isRequired,
  ...props
}) => (
  <FloatingLabelFormControl
    id={id}
    label={label}
    error={error}
    register={register}
    isRequired={isRequired}
    {...props}
  >
    <Input data-testid={id} placeholder=" " {...register} />
  </FloatingLabelFormControl>
)
export default FloatingLabelInput
