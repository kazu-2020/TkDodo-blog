import { VideoObject } from './video_object'
import { ImageHash } from './image_hash'

export type PartOfSeries = {
  name: string
  eyecatch?: ImageHash
}

export type IdentifierGroup = {
  shortenedDisplayName: string
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
  partOfSeries?: PartOfSeries
  releasedEvent?: EventData
  detailedRecentEvent?: EventData
  videos?: VideoObject[]
}
