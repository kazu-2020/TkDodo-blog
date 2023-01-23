import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormControlProps
} from '@chakra-ui/react'
import { PropertyLabel, PropertyLabelProps } from './PropertyLabel'
import { FieldError } from 'react-hook-form'
import { ReactNode } from 'react'

type FormFieldWrapperProps = {
  children: ReactNode
  helperText?: string
  error?: FieldError
} & PropertyLabelProps &
  FormControlProps

export const FormFieldWrapper = ({
  children,
  error,
  helperText,
  label,
  schemaName,
  ...formControl
}: FormFieldWrapperProps) => {
  console.log('error', error)

  return (
    <FormControl isInvalid={!!error} {...formControl}>
      <PropertyLabel {...{ label, schemaName }} />

      {children}

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}
