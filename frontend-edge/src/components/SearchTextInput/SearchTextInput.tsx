import { ChangeEvent, KeyboardEvent, useState } from 'react'
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  InputGroupProps
} from '@chakra-ui/react'
import { CloseIcon, SearchIcon } from '@chakra-ui/icons'

const clearButtonStyle = {
  cursor: 'pointer'
}

type Props = {
  placeholder?: string
  onAction?: (query: string) => void
} & InputGroupProps

export const SearchTextInput = ({
  placeholder = '',
  onAction = () => {},
  ...inputGroupProps
}: Props) => {
  const [text, setText] = useState('')
  return (
    <InputGroup h={10} {...inputGroupProps}>
      <InputLeftElement h="full" pointerEvents="none">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input
        h="full"
        data-testid="search-text-input"
        bg="white"
        type="text"
        value={text}
        placeholder={placeholder}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            onAction((event.target as HTMLInputElement).value)
          }
        }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setText(event.target.value)
        }}
      />
      {text.length > 0 && (
        <InputRightElement
          h="full"
          sx={clearButtonStyle}
          onClick={() => {
            setText('')
            onAction('')
          }}
        >
          <CloseIcon w={3} h={3} color="gray.500" />
        </InputRightElement>
      )}
    </InputGroup>
  )
}
