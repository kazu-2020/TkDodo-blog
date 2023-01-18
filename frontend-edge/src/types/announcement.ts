export const ANNOUNCEMENT_STATUS = [
  'general',
  'improved',
  'maintenance',
  'attentive',
  'emergency'
] as const

export type AnnouncementStatus = typeof ANNOUNCEMENT_STATUS[number]

export type Announcement = {
  id: number
  status: AnnouncementStatus
  contents: string
  dateCreated: string
}
