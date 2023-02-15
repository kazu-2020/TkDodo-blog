export type JobClass = 'Admin' | 'User' | undefined

export const SYSTEM_ROLE = [
  'userAdmin',
  'playlistAdmin',
  'deckAdmin',
  'readerUser'
] as const

export type SystemRole = typeof SYSTEM_ROLE[number]

export type User = {
  id: number
  firstName: string | undefined
  lastName: string | undefined
  email: string
  jobClass: JobClass
  systemRoles: SystemRole[]
  loggedInAt: string | undefined
  invitedAt: string | undefined
}
