import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import React, { FC, ReactNode } from 'react'
import { StyleProps } from '@chakra-ui/styled-system/dist/declarations/src/system.types'
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'

const isRequired = (register: UseFormRegisterReturn): boolean => {
  const { required } = register
  return required === undefined
}

type Props = {
  children: ReactNode
  register: UseFormRegisterReturn
  id: string
  label: string
  isInvalid: FieldError | undefined
}

const FloatingLabelFormControl: FC<Props & StyleProps> = ({
  children,
  register,
  id,
  label,
  isInvalid,
  ...props
}) => (
  <FormControl id={id} variant="floating" isInvalid={!!isInvalid} {...props}>
    {children}
    <FormLabel htmlFor={id} color="gray">
      {label} {isRequired(register) && <span style={{ color: 'red' }}>*</span>}
    </FormLabel>
    <FormErrorMessage>{isInvalid && isInvalid.message}</FormErrorMessage>
  </FormControl>
)
export default FloatingLabelFormControl
