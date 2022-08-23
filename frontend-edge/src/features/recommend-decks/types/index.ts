import { SameAs } from '@/types/same_as'
import { ImageHash } from '@/types/image_hash'

export type RecommendDeckFormInputs = {
  name: string
  interfix: string
  description: string
  apiState: boolean
  deckSameAsAttributes?: SameAs[]
}

export type SeriesPlaylistSearchResult = {
  name: string
  seriesId: string
  logo: ImageHash
  eyecatch: ImageHash
  hero: ImageHash
  videos: any[]
}
