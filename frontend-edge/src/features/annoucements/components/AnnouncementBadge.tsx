import { useMemo } from 'react'
import { Badge } from '@chakra-ui/react'

import { AnnouncementStatus } from '@/types/announcement'

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
      return '#FBC02D'
    default: {
      const invalidStatus: never = status
      throw new Error(`${invalidStatus}は不正な値です`)
    }
  }
}

const badgeStatement = (status: AnnouncementStatus) => {
  switch (status) {
    case 'general':
      return 'お知らせ'
    case 'improved':
      return '機能改善'
    case 'maintenance':
      return 'メンテナンス情報'
    case 'attentive':
      return '注意'
    case 'emergency':
      return '緊急'
    default: {
      const invalidStatus: never = status
      throw new Error(`${invalidStatus}は不正な値です`)
    }
  }
}

export const AnnouncementBadge = ({ status }: AnnouncementBadgeProps) => {
  const color = useMemo<string>(() => badgeColor(status), [status])
  const statement = useMemo<string>(() => badgeStatement(status), [status])

  return (
    <Badge
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

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('badgeStatement', () => {
    it('generalの場合、「お知らせ」を返すこと', () => {
      expect(badgeStatement('general')).toBe('お知らせ')
    })

    it('improvedの場合、「機能改善」を返すこと', () => {
      expect(badgeStatement('improved')).toBe('機能改善')
    })

    it('maintenanceの場合、「メンテナンス情報」を返すこと', () => {
      expect(badgeStatement('maintenance')).toBe('メンテナンス情報')
    })

    it('attentiveの場合、「注意」を返すこと', () => {
      expect(badgeStatement('attentive')).toBe('注意')
    })

    it('emergencyの場合、「緊急」を返すこと', () => {
      expect(badgeStatement('emergency')).toBe('緊急')
    })
  })
}
