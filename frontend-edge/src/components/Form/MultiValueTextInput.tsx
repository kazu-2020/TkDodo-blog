import { useController, UseControllerProps } from 'react-hook-form'
import React, { useState } from 'react'
import { CreatableSelect, OptionBase, Props } from 'chakra-react-select'
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  StyleProps
} from '@chakra-ui/react'

import { PropertyLabel, PropertyLabelProps } from './PropertyLabel'

const components = {
  DropdownIndicator: null
}

interface Option extends OptionBase {
  label: string
  value: string
}

const createOption = (label: string): Option => ({
  label,
  value: label
})

type MultiValueTextInputProps = UseControllerProps &
  Props &
  StyleProps &
  PropertyLabelProps & {
    helperText?: string
  }

export const MultiValueTextInput = ({
  control,
  name,
  label,
  schemaName,
  rules,
  helperText,
  ...props
}: MultiValueTextInputProps) => {
  const [inputValue, setInputValue] = useState('')
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error }
  } = useController({
    name,
    control,
    rules,
    defaultValue: []
  })
  const styleProps: StyleProps = props

  return (
    <FormControl isInvalid={!!error} id={name} {...styleProps}>
      <PropertyLabel {...{ label, schemaName }} />

      <Box data-testid={`${name}-input-wrapper`}>
        <CreatableSelect
          isClearable
          isMulti
          menuIsOpen={false}
          onInputChange={(newValue: string) => {
            setInputValue(newValue)
          }}
          onKeyDown={(event) => {
            if (!inputValue) return

            if (event.key === 'Enter' || event.key === 'Tab') {
              if (event.nativeEvent.isComposing) return // 全角の確定の場合は何もしない。 FIXME: ブラウザによって挙動が違うので注意
              // 重複している場合は追加しない
              if (value.some((option: Option) => option.value === inputValue))
                return
              onChange([...value, createOption(inputValue)])
              setInputValue('')
              event.preventDefault()
            }
          }}
          {...{ name, ref, components, inputValue, onChange, onBlur, value }}
          {...props}
        />
      </Box>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  )
}
