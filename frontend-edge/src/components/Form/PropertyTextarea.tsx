import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import React, { FC } from 'react'
import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormHelperText,
  Spacer,
  Textarea
} from '@chakra-ui/react'

import { PropertyLabel } from '@/components/Form/PropertyLabel'

type Props = {
  name: string
  label: string
  schemaName: string
  placeholder?: string
  helperText?: string
  register: UseFormRegisterReturn
  error: FieldError | undefined
}

export const PropertyTextarea: FC<Props & FormControlProps> = ({
  name,
  label,
  schemaName,
  placeholder,
  helperText,
  register,
  error,
  ...formControlProps
}) => (
  <FormControl id={name} isInvalid={!!error} {...formControlProps}>
    <PropertyLabel label={label} schemaName={schemaName} />
    <Textarea
      data-testid={name}
      variant="flushed"
      placeholder={placeholder}
      {...register}
    />
    {!error && !helperText && <Spacer h="20px" mt="8px" />}
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
    {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
  </FormControl>
)
