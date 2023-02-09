import { Badge, Td, Tr } from '@chakra-ui/react'

import { formatDatetimeWithWeekday } from '@/utils/format'
import { JobClass } from '@/types/user'
import Link from '@/components/Link'

type UserTableRowProps = {
  fullName: string
  email: string
  systemRole: string
  jobClass: JobClass
  loggedInAt?: string
  isInviting?: boolean
  isEven?: boolean
}

export const UserTableRow = ({
  fullName,
  email,
  systemRole,
  jobClass,
  loggedInAt,
  isInviting = false,
  isEven = false
}: UserTableRowProps) => (
  <Tr fontSize="sm" px={2} py={4} background={isEven ? '#BDBDBD33' : 'white'}>
    <Td fontSize="md" lineHeight="base" px="inherit" py="inherit">
      {/* TODO: プロフィールページへのpathに変更する */}
      <Link to="/" color="#009688">
        {fullName}
      </Link>
      {isInviting && (
        <Badge
          fontSize="11px"
          lineHeight="1rem"
          color="white"
          background="#607D8B"
          px={2}
          ml={4}
          borderRadius="full"
          verticalAlign="text-top"
        >
          招待中
        </Badge>
      )}
    </Td>
    <Td px="inherit">{email}</Td>
    <Td px="inherit">{jobClass}</Td>
    <Td px="inherit">{systemRole}</Td>
    <Td px="inherit">{loggedInAt && formatDatetimeWithWeekday(loggedInAt)}</Td>
  </Tr>
)
