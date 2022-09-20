import { ImageHash } from '@/types/image_hash'

import { EpisodeData, PartOfSeries } from './episode_data'

export type SeriesStyle = {
  textLight?: string
  textDark?: string
  linkLight?: string
  linkDark?: string
  primaryLight?: string
  primaryDark?: string
}

export type AvailableEpisodes = {
  count?: number
}

export type SeriesEpisodes = {
  count: number
  result: Array<EpisodeData>
  nextUrl: string
  resultUrl: string
}

export type SeriesData = {
  id: string
  name: string
  logo?: ImageHash
  eyecatch?: ImageHash
  hero?: ImageHash
  keyvisuals?: Array<ImageHash>
  partOfSeries?: PartOfSeries
  availableEpisodes?: AvailableEpisodes
  videos: any[]
  style: SeriesStyle
  episodes: SeriesEpisodes
}
