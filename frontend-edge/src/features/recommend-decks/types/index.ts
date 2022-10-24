import { SameAs } from '@/types/same_as'
import { ImageHash } from '@/types/image_hash'
import { RecommendPlaylist } from '@/types/recommend_playlist'

export type RecommendDeckFormInputs = {
  name: string
  interfix: string
  description?: string
  apiState: boolean
  deckSameAsAttributes?: SameAs[]
  playlists?: RecommendPlaylist[]
}

export type SeriesPlaylistSearchResult = {
  name: string
  seriesId: string
  logo: ImageHash
  eyecatch: ImageHash
  hero: ImageHash
  videos: any[]
}
