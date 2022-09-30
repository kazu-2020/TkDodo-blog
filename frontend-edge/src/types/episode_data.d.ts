import { VideoObject } from './video_object'
import { ImageHash } from './image_hash'
import { Role } from '@/types/role'

export type FormatType = {
  id: number
  name: string
}

export type ThemeType = {
  id: number
  name: string
}

export type Genre = {
  id: number
  name1: string
  name2: string
}

export type IdentifierGroup = {
  shortenedDisplayName: string
  formatGenre?: FormatType[]
  themeGenre?: ThemeType[]
  formatGenreTag?: FormatType[]
  themeGenreTag?: ThemeType[]
  genres?: Genre[]
}

export type BroadcastEvent = {
  identifierGroup: IdentifierGroup
}

export type PartOfSeries = {
  name: string
  eyecatch?: ImageHash
  logo?: ImageHash
  identifierGroup?: IdentifierGroup
}

export type PublishedOn = {
  identifierGroup: IdentifierGroup
  images: ImageHash
}

export type EventData = {
  startDate: string
  endDate: string
  publishedOn: PublishedOn
}

export type EpisodeData = {
  id: string
  name: string
  description?: string
  url?: string
  eyecatch?: ImageHash
  keyvisuals?: Array<ImageHash>
  identifierGroup: IdentifierGroup
  partOfSeries?: PartOfSeries
  releasedEvent?: EventData
  detailedRecentEvent?: EventData
  videos?: VideoObject[]
  broadcastEvent?: BroadcastEvent[]
  actors?: Array<Role>
  contributors?: Array<Role>
}
