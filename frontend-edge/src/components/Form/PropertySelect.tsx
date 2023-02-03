import { Controller, FieldValues } from 'react-hook-form'
import { ComponentProps } from 'react'
import { Select, OptionBase } from 'chakra-react-select'
import { FormControl, FormControlProps } from '@chakra-ui/react'

import { PropertyLabel, PropertyLabelProps } from './PropertyLabel'

export type SelectOption = { label: string; value: string } & OptionBase

type PropertySelectProps<T extends FieldValues> = PropertyLabelProps &
  Omit<ComponentProps<typeof Controller<T>>, 'render'> & {
    options: SelectOption[]
    formProps?: FormControlProps
    placeholder?: string
  }

export const PropertySelect = <T extends FieldValues>({
  label,
  schemaName,
  options,
  formProps,
  placeholder,
  ...controllerProps
}: PropertySelectProps<T>) => (
  <Controller
    render={({ field: { name, onChange, value, ref } }) => (
      <FormControl id={name} {...formProps} data-testId={`select-${name}`}>
        <PropertyLabel {...{ label, schemaName }} />
        <Select
          value={options.find((option) => option.value === value)}
          onChange={(newValue) => {
            if (newValue?.value) {
              onChange(newValue.value)
            }
          }}
          {...{ ref, options }}
        />
      </FormControl>
    )}
    {...controllerProps}
  />
)
