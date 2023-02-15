import { memo, useReducer, useState } from 'react'
import {
  Table,
  Thead,
  Tr,
  Th,
  TableContainer,
  Tbody,
  Box,
  Flex,
  Button,
  Text,
  Select
} from '@chakra-ui/react'

import { camelToSnake } from '@/utils/format'
import { SYSTEM_ROLE } from '@/types/user'
import { TableRowSkeletons } from '@/components/TableRowSkeleton'
import { SearchTextInput } from '@/components/SearchTextInput'
import { Pagination } from '@/components/Pagination'

import {
  changeSystemRoleToDisplayName,
  changeSystemRolesToDisplayName,
  fullName
} from '../../util/format'
import { useUsers } from '../../api/getUsers'

import { UserTableRow } from './UserTableRow'

const systemRoleOptions = [
  {
    label: '全てのロール',
    value: ''
  },
  ...SYSTEM_ROLE.map((role) => ({
    label: changeSystemRoleToDisplayName(role),
    value: camelToSnake(role)
  }))
]

type SearchParamsState = {
  keyword: string
  role?: string
}

type SearchParamsAction =
  | {
      type: 'typeText'
      payload: { keyword: string }
    }
  | {
      type: 'selectRole'
      payload: { role: string }
    }

const searchParamsReducer = (
  prevState: SearchParamsState,
  action: SearchParamsAction
) => {
  const { type, payload } = action
  switch (type) {
    case 'typeText':
      return { ...prevState, keyword: payload.keyword }
    case 'selectRole':
      return { ...prevState, role: payload.role }
    default: {
      const invalidAction: never = type
      throw new Error(`${invalidAction}は不正な値です`)
    }
  }
}

const MemoUserTableRow = memo(UserTableRow)

// eslint-disable-next-line max-lines-per-function
export const UserTable = () => {
  const [searchParameter, dispatchSearchParamter] = useReducer(
    searchParamsReducer,
    {
      keyword: '',
      role: ''
    }
  )

  const [page, setPage] = useState(1)

  const { data, isLoading } = useUsers({
    params: {
      page,
      ...searchParameter
    }
  })

  const users = data?.users ?? []
  const pagination = data?.pagination

  return (
    <Box>
      {/* 検索フォーム */}
      <Box pb={6}>
        <Flex justifyContent="space-between" mb={6}>
          <Box w="400px">
            <SearchTextInput
              placeholder="名前またはメールアドレスで検索"
              h="full"
              onAction={(keyword) =>
                dispatchSearchParamter({
                  type: 'typeText',
                  payload: { keyword }
                })
              }
            />
          </Box>
          <Button variant="accentSolid" px="78px" isDisabled>
            ユーザー招待
          </Button>
        </Flex>
        <Flex justifyContent="space-between" align="center">
          <Text fontSize="11px" lineHeight={4}>
            {`全${pagination?.count ?? 0}件`}
          </Text>

          <Select
            id="system-role"
            w="280px"
            background="white"
            onChange={(e) =>
              dispatchSearchParamter({
                type: 'selectRole',
                payload: { role: e.target.value }
              })
            }
          >
            {systemRoleOptions.map(({ label, value }) => (
              <option key={value} {...{ value }}>
                {label}
              </option>
            ))}
          </Select>
        </Flex>
      </Box>

      <TableContainer borderRadius="2px" shadow="xs" mb={6}>
        <Table variant="simple">
          <Thead>
            <Tr
              fontSize="14px"
              fontWeight="bold"
              lineHeight="20px"
              color="#757575"
              background="white"
              px={2}
              py={4}
            >
              <Th
                fontSize="inherit"
                lineHeight="inherit"
                px="inherit"
                py="inherit"
              >
                名前
              </Th>
              <Th lineHeight="inherit" px="inherit" py="inherit">
                メールアドレス
              </Th>
              <Th lineHeight="inherit" px="inherit" py="inherit">
                職位区分
              </Th>
              <Th lineHeight="inherit" px="inherit" py="inherit">
                システムロール
              </Th>
              <Th lineHeight="inherit" px="inherit" py="inherit">
                最終ログイン日時
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {isLoading ? (
              <TableRowSkeletons />
            ) : (
              users.map((user, index) => (
                <MemoUserTableRow
                  key={user.id}
                  fullName={fullName(user.firstName ?? '', user.lastName ?? '')}
                  email={user.email}
                  jobClass={user.jobClass}
                  systemRole={changeSystemRolesToDisplayName(user.systemRoles)}
                  isEven={index % 2 === 0}
                  loggedInAt={user.loggedInAt}
                />
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Pagination
        totalCount={pagination?.count}
        page={pagination?.currentPage}
        pageCount={pagination?.totalPages}
        onChangePage={setPage}
      />
    </Box>
  )
}
