import { MdSort } from 'react-icons/all'
import { ChangeEvent, useState } from 'react'
import {
  Button,
  FormLabel,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Switch
} from '@chakra-ui/react'

type Props = {
  tabIndex: number
  onChange: (params: FilterParams) => void
}

export type FilterParams = {
  searchTextType?: string
  ignoreRange?: boolean
  orderBy?: string
  order?: string
  filterService?: boolean
}

const getOrderLabel = (selectedOrderBy: string, selectedOrder: string) => {
  if (selectedOrderBy === 'score' && selectedOrder === 'desc') {
    return '関連スコア順'
  }
  if (selectedOrderBy === 'dateModified' && selectedOrder === 'desc') {
    return '新しい順'
  }
  if (selectedOrderBy === 'dateModified' && selectedOrder === 'asc') {
    return '古い順'
  }
  return '並び順'
}

export const SearchFilter = ({ onChange, tabIndex }: Props) => {
  const [orderLabel, setOrderLabel] = useState('並び順')

  const onChangeOrder = (selectedOrderBy: string, selectedOrder: string) => {
    setOrderLabel(getOrderLabel(selectedOrderBy, selectedOrder))
    onChange({ orderBy: selectedOrderBy, order: selectedOrder })
  }

  return (
    <HStack justify="space-between">
      <Select
        variant="flushed"
        w={52}
        size="sm"
        ml={2}
        my={5}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
          onChange({ searchTextType: event.target.value })
        }}
      >
        <option value="word">ワードから検索</option>
        <option value="keyword">キーワードから検索</option>
        <option value="concern">出演者から検索</option>
      </Select>
      <HStack justify="flex-end" spacing={4}>
        {tabIndex === 0 && (
          <Menu>
            <MenuButton
              fontWeight="normal"
              as={Button}
              leftIcon={<MdSort />}
              variant="ghost"
              fontSize="sm"
            >
              {orderLabel}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => onChangeOrder('score', 'desc')}>
                関連スコア順
              </MenuItem>
              <MenuItem onClick={() => onChangeOrder('dateModified', 'desc')}>
                新しい順
              </MenuItem>
              <MenuItem onClick={() => onChangeOrder('dateModified', 'asc')}>
                古い順
              </MenuItem>
            </MenuList>
          </Menu>
        )}
        <HStack alignItems="center" spacing={1}>
          <Switch
            id="only-ge-episode"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onChange({ filterService: event.target.checked })
            }}
          />
          <FormLabel htmlFor="only-ge-episode" mb="0" fontSize="xs">
            G or Eのエピソードのみ
          </FormLabel>
        </HStack>
        {tabIndex !== 2 && (
          <HStack alignItems="center" spacing={1}>
            <Switch
              id="out-range-playlist"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                onChange({ ignoreRange: event.target.checked })
              }}
            />
            <FormLabel htmlFor="out-range-playlist" mb="0" fontSize="xs">
              公開範囲外のプレイリストを含む
            </FormLabel>
          </HStack>
        )}
      </HStack>
    </HStack>
  )
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('getOrderLabel', () => {
    it('「関連スコア順」が取得できること', () => {
      expect(getOrderLabel('score', 'desc')).toEqual('関連スコア順')
    })

    it('「新しい順」が取得できること', () => {
      expect(getOrderLabel('dateModified', 'desc')).toEqual('新しい順')
    })

    it('「古い順」が取得できること', () => {
      expect(getOrderLabel('dateModified', 'asc')).toEqual('古い順')
    })

    it('「並び順」が取得できること', () => {
      expect(getOrderLabel('xxxxx', 'xxxxx')).toEqual('並び順')
    })
  })
}
