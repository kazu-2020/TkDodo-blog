import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import React, { FC, ReactNode } from 'react'
import { StyleProps } from '@chakra-ui/styled-system/dist/declarations/src/system.types'
import { FormControl, FormErrorMessage, FormLabel, Tag } from '@chakra-ui/react'

type Props = {
  children: ReactNode
  register: UseFormRegisterReturn
  id: string
  label: string
  error: FieldError | undefined
  isRequired?: boolean
}

const activeLabelStyles = {
  transform: 'scale(0.75) translateY(-24px)',
  backgroundColor: 'transparent'
}

const inputStyles = {
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  borderBottom: '1px solid',
  borderRadius: 0,
  px: '0',
  _focusVisible: {
    borderColor: 'primary',
    borderBottom: '2px solid',
    boxShadow: 'none'
  },
  _focusWithin: {
    borderColor: 'primary'
  },
  _invalid: {
    borderColor: 'red.500',
    boxShadow: 'none'
  }
}

const FormControlStyles = {
  _focusWithin: {
    label: {
      ...activeLabelStyles,
      color: 'primary'
    }
  },
  'input:not(:placeholder-shown) + label, textarea:not(:placeholder-shown) + label, .chakra-select__wrapper + label':
    {
      ...activeLabelStyles
    },
  label: {
    top: 0,
    left: 0,
    zIndex: 2,
    position: 'absolute',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    mx: 0,
    px: 0,
    my: 2,
    transformOrigin: 'left top',
    color: 'gray.600'
  },
  input: {
    ...inputStyles
  },
  textarea: {
    ...inputStyles
  },
  'label[data-invalid]': {
    color: 'red.500'
  }
}

const FloatingLabelFormControl: FC<Props & StyleProps> = ({
  children,
  register,
  id,
  label,
  error,
  isRequired = false, // FIXME: ラベル装飾のために利用。registerのrequiredは常にundefinedになって利用できないため
  ...props
}) => (
  <FormControl id={id} isInvalid={!!error} {...props} sx={FormControlStyles}>
    {children}
    <FormLabel htmlFor={id}>
      {label}{' '}
      {isRequired && ( // ChakuraのisRequiredを使うとHTML5validationが効いてしまうため独自で*をつけるように
        <Tag p={0} color="red.500" bg="transparent">
          *
        </Tag>
      )}
    </FormLabel>
    <FormErrorMessage>{error && error.message}</FormErrorMessage>
  </FormControl>
)

export default FloatingLabelFormControl
