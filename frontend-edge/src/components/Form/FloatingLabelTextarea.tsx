import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import React, { FC } from 'react'
import { StyleProps } from '@chakra-ui/styled-system/dist/declarations/src/system.types'
import { Textarea } from '@chakra-ui/react'

import FloatingLabelFormControl from './FloatingLabelFormControl'

type Props = {
  register: UseFormRegisterReturn
  id: string
  label: string
  isInvalid: FieldError | undefined
}

const FloatingLabelInputControl: FC<Props & StyleProps> = ({
  register,
  id,
  label,
  isInvalid,
  ...props
}) => (
  <FloatingLabelFormControl
    id={id}
    label={label}
    isInvalid={isInvalid}
    register={register}
    {...props}
  >
    <Textarea data-testid={id} placeholder=" " {...register} />
  </FloatingLabelFormControl>
)
export default FloatingLabelInputControl
