import { AnnouncementStatus } from '@/types/announcement'

export const convertAnnouncementStatus = (status: AnnouncementStatus) => {
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

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('badgeStatement', () => {
    it('generalの場合、「お知らせ」を返すこと', () => {
      expect(convertAnnouncementStatus('general')).toBe('お知らせ')
    })

    it('improvedの場合、「機能改善」を返すこと', () => {
      expect(convertAnnouncementStatus('improved')).toBe('機能改善')
    })

    it('maintenanceの場合、「メンテナンス情報」を返すこと', () => {
      expect(convertAnnouncementStatus('maintenance')).toBe('メンテナンス情報')
    })

    it('attentiveの場合、「注意」を返すこと', () => {
      expect(convertAnnouncementStatus('attentive')).toBe('注意')
    })

    it('emergencyの場合、「緊急」を返すこと', () => {
      expect(convertAnnouncementStatus('emergency')).toBe('緊急')
    })
  })
}
