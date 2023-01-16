const ANNOUCEMENT_STATUS = [
  'general',
  'improved',
  'maintenance',
  'attentive',
  'emergency'
] as const

export type AnnoucementStatus = typeof ANNOUCEMENT_STATUS[number]

export type Annoucement = {
  id: number
  status: AnnoucementStatus
  contents: string
  dataCreated: string
}
