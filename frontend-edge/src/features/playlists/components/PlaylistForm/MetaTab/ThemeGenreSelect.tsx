import { useController } from 'react-hook-form'
import React from 'react'
import { OptionBase, Select } from 'chakra-react-select'
import { FormControl, FormLabel } from '@chakra-ui/react'

interface Option extends OptionBase {
  label: string
  value: string
}

const options: Option[] = [
  { value: '020', label: 'スポーツ全般' },
  { value: '070', label: '音楽全般' },
  { value: '092', label: '自然' },
  { value: '093', label: '科学' },
  { value: '096', label: '芸術' },
  { value: '110', label: '福祉全般' }
]

interface FormValues {
  themeGenre: Option | null
}

export const ThemeGenreSelect = () => {
  const {
    field: { onChange, onBlur, value, ref }
  } = useController<FormValues>({
    name: 'themeGenre'
  })

  return (
    <FormControl>
      <FormLabel>ジャンル(テーマ) - Theme Genre</FormLabel>
      <Select
        name="themeGenre"
        ref={ref}
        onChange={(newValue) => {
          if (newValue?.value) {
            onChange(newValue?.value)
          }
        }}
        onBlur={onBlur}
        value={options?.find((option) => option.value === value)}
        options={options}
        variant="flushed"
        placeholder="選択して下さい"
      />
    </FormControl>
  )
}
