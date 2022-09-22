import { useController } from 'react-hook-form'
import React from 'react'
import { OptionBase, Select } from 'chakra-react-select'
import { FormControl } from '@chakra-ui/react'

import { PropertyLabel } from '@/components/Form'

interface Option extends OptionBase {
  label: string
  value: string
}

const options: Option[] = [
  { value: '00', label: 'ジャンルレス' },
  { value: '01', label: '報道' },
  { value: '02', label: 'ドキュメンタリー' },
  { value: '03', label: 'ドラマ' },
  { value: '04', label: 'アニメ' },
  { value: '05', label: 'バラエティ' },
  { value: '06', label: '映画' },
  { value: '08', label: 'PR・お知らせ' },
  { value: '09', label: '講座' }
]

interface FormValues {
  formatGenre: Option | null
}

export const FormatGenreSelect = () => {
  const {
    field: { onChange, onBlur, value, ref }
  } = useController<FormValues>({
    name: 'formatGenre'
  })

  return (
    <FormControl>
      <PropertyLabel label="ジャンル(フォーマット)" schemaName="Format Genre" />
      <Select
        name="formatGenre"
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
