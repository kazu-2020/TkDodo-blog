import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import React, { FC } from 'react'
import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormHelperText,
  Input
} from '@chakra-ui/react'

import { PropertyLabel } from '@/components/Form/PropertyLabel'

type Props = {
  name: string
  label: string
  schemaName?: string
  placeholder?: string
  helperText?: string
  register: UseFormRegisterReturn
  error: FieldError | undefined
  inputType?: string
}

export const PropertyInput: FC<Props & FormControlProps> = ({
  name,
  label,
  schemaName,
  placeholder,
  helperText,
  register,
  error,
  inputType = 'text',
  ...formControlProps
}) => (
  <FormControl id={name} isInvalid={!!error} {...formControlProps}>
    <PropertyLabel label={label} schemaName={schemaName} />
    <Input
      data-testid={name}
      variant="flushed"
      placeholder={placeholder}
      type={inputType}
      {...register}
    />
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
    {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
  </FormControl>
)
