import { Article } from '@/types/article'

import { ImageHash } from './image_hash'

export type RecommendPlaylist = {
  primaryId: number
  id?: string
  playlistUId: string
  stringId: string
  seriesId: string
  name: string
  logo: ImageHash
  videos: any[]
  itemNum?: number
  howToCount?: number
  eventCount?: number
  faqPageCount?: number
  article: Article
  playableItemsCount?: number
}
