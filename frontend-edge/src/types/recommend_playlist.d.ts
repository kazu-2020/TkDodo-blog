import { ImageHash } from './image_hash'

export type RecommendPlaylist = {
  id?: string
  stringId: string
  seriesId: string
  name: string
  logo: ImageHash
  videos: any[]
  itemNum?: number
  howToCount?: number
  eventCount?: number
  faqPageCount?: number
}
