export interface ImageObject {
  url: string
  width: number
  height: number
}

export interface Eyecatch {
  medium: ImageObject
}

export interface PartOfSeries {
  name: string
}

export interface IdentifierGroup {
  shortenedDisplayName: string
}

export interface PublishOn {
  identifierGroup: IdentifierGroup
}

export interface EventData {
  startDate: string
  publishedOn: PublishOn
}

export interface EpisodeData {
  name?: string
  description?: string
  url?: string
  eyecatch?: Eyecatch
  partOfSeries?: PartOfSeries
  detailedRecentEvent?: EventData
}
