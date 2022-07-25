import { ChangeEvent, KeyboardEvent, useState } from 'react'
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement
} from '@chakra-ui/react'
import { CloseIcon, SearchIcon } from '@chakra-ui/icons'

const clearButtonStyle = {
  cursor: 'pointer'
}

type Props = {
  placeholder?: string
  onAction?: (query: string) => void
}

const SearchTextInput = ({ placeholder = '', onAction = () => {} }: Props) => {
  const [text, setText] = useState('')
  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        children={<SearchIcon color="gray.300" />}
      />
      <Input
        bg="white"
        type="text"
        value={text}
        placeholder={placeholder}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === 'Enter') {
            onAction((event.target as HTMLInputElement).value)
          }
        }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setText(event.target.value)
        }}
      />
      {text.length > 0 && (
        <InputRightElement
          sx={clearButtonStyle}
          children={<CloseIcon w={10} h={10} color="gray.500" />}
          onClick={() => {
            setText('')
            onAction('')
          }}
        />
      )}
    </InputGroup>
  )
}

export default SearchTextInput
