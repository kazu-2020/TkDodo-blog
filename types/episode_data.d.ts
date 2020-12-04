import { ImageHash } from './image_hash'

export interface PartOfSeries {
  name: string
}

export interface IdentifierGroup {
  shortenedDisplayName: string
}

export interface PublishedOn {
  identifierGroup: IdentifierGroup
  images: ImageHash
}

export interface EventData {
  startDate: string
  publishedOn: PublishedOn
}

export interface EpisodeData {
  id?: string
  name?: string
  description?: string
  url?: string
  eyecatch?: ImageHash
  partOfSeries?: PartOfSeries
  detailedRecentEvent?: EventData
  videos?: object[]
}
