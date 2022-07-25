import { ChangeEventHandler } from 'react'
import { Select } from '@chakra-ui/react'

type Props = {
  defaultValue?: string
  onChange?: ChangeEventHandler<HTMLSelectElement>
}

const APIStatusSelect = ({
  defaultValue = 'open',
  onChange = undefined
}: Props) => (
  <Select
    variant="outline"
    bg="white"
    onChange={onChange}
    defaultValue={defaultValue}
  >
    <option value="open">API公開中のみ</option>
    <option value="close">API非公開のみ</option>
    <option value="">全て</option>
  </Select>
)

export default APIStatusSelect
