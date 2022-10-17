import { ChangeEvent } from 'react'
import { Select } from '@chakra-ui/react'

type Props = {
  defaultValue?: string
  onChange?: (value: string) => void
}

export const APIStatusSelect = ({
  defaultValue = 'open',
  onChange = undefined
}: Props) => (
  <Select
    data-testid="api-status-select"
    variant="outline"
    bg="white"
    onChange={(event: ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(event.target.value)
      }
    }}
    defaultValue={defaultValue}
  >
    <option value="open">API公開中のみ</option>
    <option value="close">API非公開のみ</option>
    <option value="">全て</option>
  </Select>
)
