import { useMemo } from 'react'
import { Badge } from '@chakra-ui/react'

import { AnnouncementStatus } from '@/types/announcement'

import { convertAnnouncementStatus } from '../utils/convertAnnouncementStatus'

type AnnouncementBadgeProps = {
  status: AnnouncementStatus
}

const badgeColor = (status: AnnouncementStatus) => {
  switch (status) {
    case 'general':
      return '#388E3C'
    case 'improved':
      return '#7B1FA2'
    case 'maintenance':
      return '#1976D2'
    case 'attentive':
      return '#C02710'
    case 'emergency':
      return '#C0A20C'
    default: {
      const invalidStatus: never = status
      throw new Error(`${invalidStatus}は不正な値です`)
    }
  }
}

export const AnnouncementBadge = ({ status }: AnnouncementBadgeProps) => {
  const color = useMemo<string>(() => badgeColor(status), [status])
  const statement = useMemo<string>(
    () => convertAnnouncementStatus(status),
    [status]
  )

  return (
    <Badge
      data-testid="announcement-badge"
      variant="solid"
      background={color}
      w={28}
      textAlign="center"
      borderRadius="full"
    >
      {statement}
    </Badge>
  )
}
