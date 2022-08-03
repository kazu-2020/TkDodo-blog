import { ImageHash } from '@/types/image_hash'

export type SeriesDeckFormInputs = {
  name: string
  interfix: string
  description: string
  apiState: boolean
}

export type SeriesPlaylistSearchResult = {
  name: string
  seriesId: string
  logo: ImageHash
  eyecatch: ImageHash
  hero: ImageHash
  videos: any[]
}
