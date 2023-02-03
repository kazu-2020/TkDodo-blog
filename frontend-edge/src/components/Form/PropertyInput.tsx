import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { HTMLInputTypeAttribute } from 'react'
import {
  FormControl,
  FormControlProps,
  FormErrorMessage,
  FormHelperText,
  Input,
  Spacer
} from '@chakra-ui/react'

import {
  PropertyLabel,
  PropertyLabelProps
} from '@/components/Form/PropertyLabel'

type PropertyInputProps = {
  placeholder?: string
  helperText?: string
  register: UseFormRegisterReturn
  error: FieldError | undefined
  inputType?: HTMLInputTypeAttribute
} & PropertyLabelProps &
  FormControlProps

export const PropertyInput = ({
  label,
  schemaName,
  placeholder,
  helperText,
  register,
  error,
  inputType = 'text',
  ...formControlProps
}: PropertyInputProps) => (
  <FormControl id={register.name} isInvalid={!!error} {...formControlProps}>
    <PropertyLabel {...{ label, schemaName }} />
    <Input
      data-testid={register.name}
      type={inputType}
      {...{ placeholder }}
      {...register}
    />
    {!error && !helperText && <Spacer h="20px" mt="8px" />}
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
    {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
  </FormControl>
)
