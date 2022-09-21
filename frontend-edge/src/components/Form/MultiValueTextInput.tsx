import { useController, UseControllerProps } from 'react-hook-form'
import React, { useState } from 'react'
import { CreatableSelect, OptionBase, Props } from 'chakra-react-select'
import { StyleProps } from '@chakra-ui/styled-system/dist/declarations/src/system.types'
import { FormControl, FormErrorMessage, FormHelperText } from '@chakra-ui/react'

import { PropertyLabel } from './PropertyLabel'

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
  StyleProps & {
    label: string
    schemaName: string
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
      <PropertyLabel label={label} schemaName={schemaName} />

      <CreatableSelect
        name={name}
        data-testid={name}
        ref={ref}
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={onChange}
        onBlur={onBlur}
        onInputChange={(newValue: string) => {
          setInputValue(newValue)
        }}
        onKeyDown={(event) => {
          if (!inputValue) return

          // eslint-disable-next-line default-case
          switch (event.key) {
            case 'Enter':
            case 'Tab':
              // 重複している場合は追加しない
              if (value.some((option: Option) => option.value === inputValue))
                return
              onChange([...value, createOption(inputValue)])
              setInputValue('')
              event.preventDefault()
          }
        }}
        variant="flushed"
        value={value}
        {...props}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  )
}
