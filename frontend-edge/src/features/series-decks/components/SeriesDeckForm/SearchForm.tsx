import React, { ChangeEvent } from 'react'
import { Select } from '@chakra-ui/react'

import { SearchTextInput } from '@/components/SearchTextInput'

export const SearchForm = ({
  onAction,
  onChange
}: {
  onAction: (q: string) => void
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
}) => (
  <>
    <SearchTextInput placeholder="シリーズを検索する" onAction={onAction} />

    <Select
      variant="flushed"
      w={52}
      size="sm"
      ml={2}
      my={5}
      onChange={onChange}
    >
      <option value="word">ワードから検索</option>
      <option value="keyword">キーワードから検索</option>
      <option value="concern">出演者から検索</option>
    </Select>
  </>
)
