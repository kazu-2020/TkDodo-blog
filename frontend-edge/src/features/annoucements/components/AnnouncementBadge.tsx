import { AnnoucementStatus } from '@/types/announcement'
import { Badge } from '@chakra-ui/react'
import { useMemo } from 'react'
import { render, screen } from '@testing-library/react'
import { composeStories } from '@storybook/testing-react'

type AnnouncementBadgeProps = {
  status: AnnoucementStatus
}

export const AnnouncementBadge = ({ status }: AnnouncementBadgeProps) => {
  const badgeColor = useMemo<string>(() => {
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
      default:
        const invalidStatus: never = status
        throw new Error(`${invalidStatus}は不正な値です`)
    }
  }, [status])

  const badgeStatement = useMemo<string>(() => {
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
      default:
        const invalidStatus: never = status
        throw new Error(`${invalidStatus}は不正な値です`)
    }
  }, [status])

  return (
    <Badge
      variant="solid"
      background={badgeColor}
      w={28}
      textAlign="center"
      borderRadius="full"
    >
      {badgeStatement}
    </Badge>
  )
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  const stories = await import('./AnnouncementBadge.stories')
  const { General, Improved, Maintenance, Attentive, Emergency } =
    composeStories(stories)

  describe('お知らせバッチの文言', () => {
    it('generalの場合、「お知らせ」と表示されること', () => {
      render(<General />)
      expect(screen.getByText('お知らせ')).toBeInTheDocument()
    })

    it('improvedの場合、「機能改善」と表示されること', () => {
      render(<Improved />)
      expect(screen.getByText('機能改善')).toBeInTheDocument()
    })

    it('attentiveの場合、「注意」と表示されること', () => {
      render(<Attentive />)
      expect(screen.getByText('注意')).toBeInTheDocument()
    })

    it('maitenanceの場合、「メンテナンス情報」と表示されること', () => {
      render(<Maintenance />)

      expect(screen.getByText('メンテナンス情報')).toBeInTheDocument()
    })

    it('emargencyの場合、「緊急」と表示されること', () => {
      render(<Emergency />)
      expect(screen.getByText('緊急')).toBeInTheDocument()
    })
  })
}
