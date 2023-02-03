import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormHelperText,
  Spacer,
  Textarea
} from '@chakra-ui/react'

import {
  PropertyLabel,
  PropertyLabelProps
} from '@/components/Form/PropertyLabel'

type PropertyTextareaProps = {
  placeholder?: string
  helperText?: string
  register: UseFormRegisterReturn
  error: FieldError | undefined
} & PropertyLabelProps &
  FormControlProps

export const PropertyTextarea = ({
  label,
  schemaName,
  placeholder,
  helperText,
  register,
  error,
  ...formControlProps
}: PropertyTextareaProps) => (
  <FormControl id={register.name} isInvalid={!!error} {...formControlProps}>
    <PropertyLabel {...{ label, schemaName }} />
    <Textarea
      data-testid={register.name}
      placeholder={placeholder}
      {...register}
    />
    {!error && !helperText && <Spacer h="20px" mt="8px" />}
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
    {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
  </FormControl>
)
